import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon } from 'tdesign-icons-react'
import { Button, Layout, Menu, Radio, RadioValue, Tag } from 'tdesign-react'
import RadioGroup from 'tdesign-react/es/radio/RadioGroup'
import 'tdesign-react/es/style/index.css'
import logo from './logo.svg'
import Borrow from './pages/borrow'
import Home from './pages/home'
import Return from './pages/return'
import borrowService from './services/borrow'
import returnService from './services/return'

const { Header, Content } = Layout
const { HeadMenu } = Menu

const App: React.FC = () => {
  const [bookList, setBookList] = useState<number[]>([])
  const [dev, setDev] = useState(false)
  const [development, setDevelopment] = useState<RadioValue>('off')
  const navigate = useNavigate()

  const handleRadio = async (value: RadioValue) => {
    setDevelopment(value)
    setDev(true)
    if (value === 'borrow') {
      const book = await borrowService.getRandomBook()
      setBookList(book)
      navigate('/borrow', { replace: true })
    }
    if (value === 'return') {
      const book = await returnService.getRandomBorrow()
      setBookList(book)
      navigate('/return', { replace: true })
    }
    if (value === 'off') {
      setDev(false)
      setBookList([])
      navigate('/', { replace: true })
    }
  }

  let location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      setDevelopment('off')
      setDev(false)
      setBookList([])
    }
  }, [location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <HeadMenu
          logo={
            <img
              height='64px'
              src={logo}
              alt='logo'
              style={{ marginLeft: '24px' }}
            />
          }
          operations={
            <div className='t-menu__operations'>
              {/* 👇开发演示功能，系统上线前请注释👇 */}
              <Tag size='large'>开发者模式</Tag>
              <RadioGroup
                variant='default-filled'
                value={development}
                onChange={handleRadio}
              >
                <Radio.Button value='off'>关闭</Radio.Button>
                <Radio.Button value='borrow'>借书</Radio.Button>
                <Radio.Button value='return'>还书</Radio.Button>
              </RadioGroup>
              {/* 👆开发演示功能，系统上线前请注释👆 */}
              <Link to='/' style={{ textDecoration: 'none' }}>
                <Button icon={<HomeIcon />} variant='outline' size='large'>
                  返回首页
                </Button>
              </Link>
            </div>
          }
        />
      </Header>
      <Content className='content'>
        <Routes>
          <Route
            path='/borrow'
            element={<Borrow bookList={bookList} dev={dev} />}
          />
          <Route
            path='/return'
            element={<Return bookList={bookList} dev={dev} />}
          />
          <Route path='/' element={<Home />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
