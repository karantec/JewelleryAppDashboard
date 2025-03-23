import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import AddProduct from '../../features/Product'




function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Products Adds" }))
      }, [])


    return(
        <AddProduct/>
    )
}

export default InternalPage