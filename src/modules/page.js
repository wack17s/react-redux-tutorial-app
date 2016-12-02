//constants
const GET_PHOTOS_REQUEST = 'GET_PHOTOS_REQUEST'
const GET_PHOTOS_SUCCESS = 'GET_PHOTOS_SUCCESS'
const GET_PHOTOS_FAIL = 'GET_PHOTOS_FAIL'

const initialState = {
  year: 2016,
  photos: [],
  fetching: false,
  error: ''
}

//reducer
export default function page(state = initialState, action) {

  switch (action.type) {
    case GET_PHOTOS_REQUEST:
      return { ...state, year: action.payload, fetching: true, error: '' }

    case GET_PHOTOS_SUCCESS:
      return { ...state, photos: action.payload, fetching: false, error: '' }

    case GET_PHOTOS_FAIL:
      return { ...state, error: action.payload.message, fetching: false }

    default:
      return state;
  }

}

//actions
let photosArr = []
let cached = false

function makeYearPhotos(photos, selectedYear) {
  let createdYear, yearPhotos = []

  photos.forEach((item) => {
    createdYear = new Date(item.created*1000).getFullYear()
    if (createdYear === selectedYear ) {
      yearPhotos.push(item)
    }
  })

  yearPhotos.sort((a,b) => b.likes.count-a.likes.count);

  return yearPhotos
}

function getMorePhotos(offset, count, year, dispatch) {
  VK.Api.call('photos.getAll', {extended:1, count: count, offset: offset},(r) => { // eslint-disable-line no-undef
    try {
      if (offset <= r.response[0] - count) {
        offset+=count;
        photosArr = photosArr.concat(r.response)
        getMorePhotos(offset,count,year,dispatch)
      } else {
        photosArr = photosArr.concat(r.response)
        let photos = makeYearPhotos(photosArr, year)
        cached = true
        dispatch({
          type: GET_PHOTOS_SUCCESS,
          payload: photos
        })
      }
    }
    catch(e) {
      dispatch({
        type: GET_PHOTOS_FAIL,
        error: true,
        payload: new Error(e)
      })
    }

  })
}

export function getPhotos(year) {

  return (dispatch) => {
    dispatch({
      type: GET_PHOTOS_REQUEST,
      payload: year
    })

    if (cached) {
      let photos = makeYearPhotos(photosArr, year)
      dispatch({
        type: GET_PHOTOS_SUCCESS,
        payload: photos
      })
    } else {
      getMorePhotos(0,200,year,dispatch)
    }

  }
}
