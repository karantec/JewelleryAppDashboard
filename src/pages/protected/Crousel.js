import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import ViewCategoriesPage from "../../features/leads copy 5";
import Crousel from "../../features/leads copy 5/index copy 2";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Crousel" }));
  }, []);

  return <Crousel />;
}

export default InternalPage;
