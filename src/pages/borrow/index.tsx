import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dialog,
  MessagePlugin,
  PrimaryTableCol,
  Table,
} from 'tdesign-react'
import borrowService from '../../services/borrow'

interface BookType {
  id: number
  name: string
  writer: string
  isbn: string
  price: string
  publicTime: string
  publisher: string
  state: number
  coverUrl: string
  info: string
}

interface BorrowType {
  bookList: number[]
  dev: boolean
}

const columns: PrimaryTableCol[] = [
  {
    title: '书名',
    colKey: 'name',
    align: 'center',
  },
  {
    title: '作者',
    colKey: 'writer',
    align: 'center',
  },
  {
    title: '价格',
    colKey: 'price',
    align: 'center',
  },
]

const Borrow: React.FC<BorrowType> = ({ bookList, dev }) => {
  const navigate = useNavigate()
  const [book, setBook] = useState<BookType[] | []>([])
  const [readerId, setReaderId] = useState<number>(0)

  // 用户将书取走，表中也要把对应的图书去掉
  // 入参为演示需要，实际移除的书需要从设备请求获取
  // 缺少设备接口，只能先这么写
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeBook = useCallback(
    (bookId: number) => {
      setBook(book.filter(value => value.id !== bookId))
    },
    [book]
  )

  const getBookEligibility = useCallback(async () => {
    book.forEach(async value => {
      try {
        const response = await borrowService.getBorrowingEligibility(
          value.id,
          readerId
        )
        if (response.status === 200) {
          const eligibility: boolean = response.data.Eligibility
          if (!eligibility) {
            MessagePlugin.warning(
              `《${value.name}》不可借阅，请放回书架`,
              5 * 1000
            )
            setButtonDisable(true)
            if (dev) {
              // 模拟用户把书取走
              removeBook(value.id)
              setButtonDisable(false)
            }
            if (!dev) {
              setTimeout(() => {
                // 需要一个轮询接口，获取图书变化
                // 超时未取走图书，返回首页
                navigate('/', { replace: true })
              }, 30 * 1000)
            }
          }
        }
      } catch {
        MessagePlugin.error('系统错误，请联系前台', 5 * 1000)
        navigate('/', { replace: true })
      }
    })
  }, [book, dev, navigate, readerId, removeBook])

  const getBook = useCallback(
    async (bookList: number[]) => {
      try {
        const response = await borrowService.getBook(bookList)
        if (response.status === 200) {
          const data = response.data.book
          setBook(book.concat(data))
          getBookEligibility()
        }
      } catch {
        MessagePlugin.error('系统错误，请联系前台', 5 * 1000)
        navigate('/', { replace: true })
      }
    },
    [book, getBookEligibility, navigate]
  )

  const [putBookVisible, setPutBookVisible] = useState(false)

  const [swipeTipsVisible, setSwipeTipsVisible] = useState(false)

  // 缺少设备接口，只能先这么写
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getReaderId = useCallback(async () => {
    // 向设备请求获取读者的ID
    if (!dev) {
      setSwipeTipsVisible(true)
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 5 * 1000)
      return
      // 获取卡号后隐藏
      // setSwipeTipsVisible(false)
    }
    // 以下代码为演示需要
    if (dev) {
      const reader = await borrowService.getReader()
      setReaderId(reader)
      try {
        const response = await borrowService.getBorrowsByReaderIdWithTimeout(
          reader
        )
        if (response.status === 200) {
          const count: number = response.data.count
          if (count === 0) {
            return
          }
          MessagePlugin.warning(
            `你有${count}本图书超期未归还，请先归还图书`,
            5 * 1000
          )
          navigate('/', { replace: true })
        }
      } catch {
        MessagePlugin.error('系统错误，请联系前台', 5 * 1000)
        navigate('/', { replace: true })
      }
    }
  }, [dev, navigate])

  useEffect(() => {
    getReaderId()
    if (!bookList || bookList === [] || bookList.length === 0) {
      // 应该是`!swipeTipsVisible`，但在这有bug，就改了一下
      if (swipeTipsVisible) {
        setPutBookVisible(true)
      }
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 5 * 1000)
      return
    }
    getBook(bookList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [buttonDisable, setButtonDisable] = useState(false)

  const [borrowVisible, setBorrowVisible] = useState(false)

  const handleBorrowButton = async () => {
    const bookIds = book.map(value => value.id)
    try {
      const response = await borrowService.checkLoanAmount(readerId, bookIds)
      if (response.status === 400) {
        MessagePlugin.error('网络错误，请重试', 5 * 1000)
        navigate('/', { replace: true })
        return
      }
      if (response.status === 200) {
        const result: boolean = response.data.result
        if (result) {
          // MessagePlugin.info('正在办理借阅，请稍后', 3 * 1000)
          setBorrowVisible(true)
          const response = await borrowService.createBorrow(readerId, bookIds)
          // setBorrowVisible(false)
          if (response.status === 201) {
            const amount = response.data.amount
            MessagePlugin.success(`借阅成功，押金剩余${amount}元`, 5 * 1000)
            navigate('/', { replace: true })
            return
          }
          MessagePlugin.error('网络错误，请重试', 5 * 1000)
          navigate('/', { replace: true })
          return
        }
        if (!result) {
          // 应该弹出modal，让用户确认
          const amount = response.data.amount
          MessagePlugin.warning(
            `可用余额${amount}元，借阅金额超出上限，请将部分图书放回书架`,
            5 * 1000
          )
          navigate('/', { replace: true })
          return
        }
      }
    } catch {
      MessagePlugin.error('系统错误，请联系前台', 5 * 1000)
      navigate('/', { replace: true })
    }
  }

  return (
    <div
      style={{
        margin: 24,
        padding: 24,
        backgroundColor: '#fff',
      }}
    >
      <Dialog
        closeBtn={false}
        closeOnEscKeydown
        closeOnOverlayClick={false}
        destroyOnClose={true}
        draggable={false}
        mode='modal'
        placement='center'
        preventScrollThrough={false}
        showOverlay
        theme='info'
        visible={swipeTipsVisible}
        footer={false}
      >
        <p>请刷借阅卡</p>
      </Dialog>
      <Dialog
        closeBtn={false}
        closeOnEscKeydown
        closeOnOverlayClick={false}
        destroyOnClose={true}
        draggable={false}
        mode='modal'
        placement='center'
        preventScrollThrough={false}
        showOverlay
        theme='info'
        visible={putBookVisible}
        footer={false}
      >
        <p>请放置图书</p>
      </Dialog>
      <Dialog
        closeBtn={false}
        closeOnEscKeydown
        closeOnOverlayClick={false}
        destroyOnClose={true}
        draggable={false}
        mode='modal'
        placement='center'
        preventScrollThrough={false}
        showOverlay
        theme='info'
        visible={borrowVisible}
        footer={false}
      >
        <p>正在办理借阅，请稍后</p>
      </Dialog>
      <div style={{ float: 'left', fontSize: 24 }}>图书列表</div>
      <Button
        size='large'
        style={{ float: 'right' }}
        disabled={buttonDisable}
        onClick={handleBorrowButton}
      >
        确认借书
      </Button>
      <Table data={book} columns={columns} rowKey='id' />
    </div>
  )
}

export default Borrow
