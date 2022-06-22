import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dialog,
  MessagePlugin,
  PrimaryTableCol,
  Table,
} from 'tdesign-react'
import returnService from '../../services/return'

interface ReaderType {
  id: number
  name: string
  mobile: string
  deposit: number
  amount: number
  state: number
}

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
  id: number
  reader: ReaderType
  book: BookType
  borrowTime: Date
}

interface ReturnType {
  bookList: number[]
  dev: boolean
}

const columns: PrimaryTableCol[] = [
  {
    title: '书名',
    colKey: 'book.name',
    align: 'center',
  },
  {
    title: '作者',
    colKey: 'book.writer',
    align: 'center',
  },
  {
    title: '价格',
    colKey: 'book.price',
    align: 'center',
  },
  {
    title: '借书时间',
    colKey: 'borrowTime',
    align: 'center',
  },
]

const Return: React.FC<ReturnType> = ({ bookList, dev }) => {
  const [putBookVisible, setPutBookVisible] = useState(false)
  const [books, setBooks] = useState<BorrowType[]>([])
  const navigate = useNavigate()

  const getBook = useCallback(
    async (bookList: number[]) => {
      try {
        const response = await returnService.getBorrow(bookList)
        if (response.status === 200) {
          const data = response.data.borrow
          setBooks(books.concat(data))
        }
      } catch {
        MessagePlugin.error('系统错误，请联系前台', 5 * 1000)
        navigate('/', { replace: true })
      }
    },
    [books, navigate]
  )

  useEffect(() => {
    if (!bookList || bookList === [] || bookList.length === 0) {
      setPutBookVisible(true)
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 5 * 1000)
      return
    }
    getBook(bookList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReturnButton = async () => {
    const borrowList = books.map(value => value.id)
    try {
      const response = await returnService.returnBook(borrowList)
      if (response.status === 200) {
        MessagePlugin.success('还书成功', 5 * 1000)
        navigate('/', { replace: true })
        return
      }
      MessagePlugin.error('网络错误，请重试', 5 * 1000)
      navigate('/', { replace: true })
      return
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
        visible={putBookVisible}
        footer={false}
      >
        <p>请放置书本</p>
      </Dialog>
      <div style={{ float: 'left', fontSize: 24 }}>图书列表</div>
      <Button
        size='large'
        style={{ float: 'right' }}
        onClick={handleReturnButton}
      >
        确认还书
      </Button>
      <Table data={books} columns={columns} rowKey='id' />
    </div>
  )
}

export default Return
