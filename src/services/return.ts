import axios from 'axios'

const baseUrl = '/borrow'

const returnBook = async (bookList: number[]) => {
  const response = await axios.put(`${baseUrl}/return-book`, bookList)
  return response
}

const getBorrow = async (bookList: number[]) => {
  const response = await axios.post(`${baseUrl}/get-borrow`, bookList)
  return response
}

// 以下代码为演示需要，上线前请删除

const getRandomBorrow = async () => {
  const response = await axios.get(`${baseUrl}/random-borrow`)
  return response.data.borrow
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getRandomBorrow, returnBook, getBorrow }
