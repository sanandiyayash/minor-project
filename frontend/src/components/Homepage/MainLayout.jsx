import LeftSideSection from "./LeftSideSection";
import { Outlet } from "react-router-dom";
function MainLayout() {
    return (
        <div className='main-Container'>
            <div className='left-section w-1/4 bg-gray-200'>
                <LeftSideSection />
            </div>
            <div className='right-section bg-white w-3/4 p-8 overflow-auto'>
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout
