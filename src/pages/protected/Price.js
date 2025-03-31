import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'

import GoldPriceManagement from '../../features/leads copy 5/index copy'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Categories" }))
      }, [])


return(
        <GoldPriceManagement/>
    )
}

export default InternalPage