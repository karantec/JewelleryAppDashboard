import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import ViewProductsPage from '../../features/leads copy 4'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "View Jewellery" }))
      }, [])


    return(
        <ViewProductsPage />
    )
}

export default InternalPage