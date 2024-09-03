import { Route, Routes, useLocation } from 'react-router-dom';
import { Login, Register, Invoice, InvoiceForm, InvoiceDetails } from './components';
import MainLayout from './components/Homepage/MainLayout';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import AddItems from './components/Items/AddItems';
import AllItems from './components/Items/AllItems';
import EditItem from './components/Items/EditItem';

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All other routes will use MainLayout */}
        {!isAuthPage && (
          <Route element={<MainLayout />}>
            <Route path="/" element={<Invoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/invoice/new" element={<InvoiceForm />} />
            <Route path='/item/new' element={<AddItems />} />
            <Route path='/item' element={<AllItems />} />
            <Route path='/item/:itemId/edit' element={<EditItem />} />

          </Route>
        )}
      </Routes>

    </>
  );
}

export default App;
