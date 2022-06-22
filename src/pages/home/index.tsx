import { Space } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'tdesign-react'
import logo from '../../logo.svg'
import './index.css'

const Home: React.FC = () => {
  return (
    <div
      className='Home'
      style={{
        height: 'calc(100vh - 64px)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          height: '100%',
          width: '100vw',
        }}
      >
        <div
          style={{
            backgroundColor: '#7787A2',
            color: '#fff',
            textAlign: 'center',
            borderRadius: 8,
            margin: 'calc(120px - 64px) 0px 0px 100px',
            position: 'absolute',
            width: 80,
            height: 40,
            fontSize: 24,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Space />
          福州
          <Space />
        </div>
        <div
          style={{
            position: 'absolute',
            margin: 'calc(180px - 64px) 0px 0px 100px',
            fontSize: 92,
            fontWeight: 700,
            color: '#2C3645',
          }}
        >
          Smart Library
        </div>
        <div
          style={{
            position: 'absolute',
            fontSize: 92,
            color: '#2C3645',
            fontWeight: 900,
            margin: 'calc(310px - 64px) 0px 0px 100px',
          }}
        >
          智慧图书馆
        </div>
        <div
          style={{
            position: 'absolute',
            margin: 'calc(460px - 64px) 0px 0px 100px',
            width: 120,
            height: 120,
            padding: 20,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 24,
            backdropFilter: 'blur(10px)',
          }}
        >
          <img src={logo} alt='logo' />
        </div>
        <div
          style={{
            position: 'relative',
            margin: '100px 0px 0px 900px',
            width: '400px',
          }}
        >
          <Link to='/borrow' style={{ textDecoration: 'none' }}>
            <Button
              block
              size='large'
              style={{
                height: '247px',
                margin: '24px auto',
                width: '400px',
                fontSize: 36,
                backgroundColor: 'rgba(0,82,217,0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              借书
            </Button>
          </Link>
          <Link to='/return' style={{ textDecoration: 'none' }}>
            <Button
              block
              size='large'
              variant='outline'
              style={{
                height: '247px',
                margin: '24px auto',
                width: '400px',
                fontSize: 36,
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              还书
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
