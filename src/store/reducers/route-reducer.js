import { CHANGE_ROUTE ,DELETE_ROUTE} from '../actions/route-actions';


const initialState = {
  routeInfo:{
    title:"",
    path:""
  },
  routeArray:[{
    title:"",
    path:""
  }]
}
export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ROUTE:
      return {
        ...state,
        routeInfo: action.payload.routeInfo,
        routeArray:getNewRouteArray(state.routeArray,action.payload.routeInfo)
      }

    case DELETE_ROUTE:
      return {
        ...state,      
        routeArray:deletePath(state.routeArray,action.payload.path)
      }

    default:
      return {
        ...state
      }
      break;
  }
}

const getNewRouteArray = (array,routeInfo)=>{
  let isFind = array.find(function(element) {
    return element.path == routeInfo.path
  });
  return isFind? array:[...array,routeInfo]
}

const deletePath = (arr,path)=>{
  let newArr = arr.filter(item=>{return item.path != path});
   return newArr;
}