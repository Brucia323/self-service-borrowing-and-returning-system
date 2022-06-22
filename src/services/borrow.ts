import axios from 'axios'

const baseUrl = '/borrow'

const getBook = async (bookList: number[]) => {
  const response = await axios.post(`${baseUrl}/get-book`, bookList)
  return response
}

const getBorrowsByReaderIdWithTimeout = async (readerId: number) => {
  const response = await axios.get(`${baseUrl}/timeout/${readerId}`)
  return response
}

const getBorrowingEligibility = async (bookId: number, readerId: number) => {
  const response = await axios.post(`${baseUrl}/eligibility`, {
    bookId,
    readerId,
  })
  return response
}

const checkLoanAmount = async (readerId: number, bookLIst: number[]) => {
  const response = await axios.post(
    `${baseUrl}/check-loan-amount/${readerId}`,
    bookLIst
  )
  return response
}

const createBorrow = async (readerId: number, bookList: number[]) => {
  const response = await axios.post(`${baseUrl}/${readerId}`, bookList)
  return response
}

// 以下代码为演示需要，上线前请删除

const getReader = async () => {
  const response = await axios.get(`${baseUrl}/random-reader`)
  return response.data.readerId
}

const getRandomBook = async () => {
  const response = await axios.get(`${baseUrl}/random-book`)
  return response.data.book
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getBook,
  getReader,
  getBorrowsByReaderIdWithTimeout,
  getBorrowingEligibility,
  getRandomBook,
  checkLoanAmount,
  createBorrow,
}
