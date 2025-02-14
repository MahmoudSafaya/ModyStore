import React from 'react'

// const adminNav = [
//   { icon: <House />, label: "الرئيسية", link: '/admin' },
//   { icon: <PackagePlus />, label: "تسجيل اوردر", link: '/admin/place-order' },
//   { icon: <PackageOpen />, label: "قائمة الطلبات", link: '/admin/orders' },
//   { icon: <Settings />, label: "الإعدادات", link: '/admin/settings' },
// ];

const Sidebar = () => {
  return (
    <div className='flex fixed top-0 right-0 z-40 h-screen w-[50px] shadow-sm'>
      {/* <div className="mt-4 md:mt-8">
        {adminNav.map((item, index) => (
          <nav key={index}>
            <Link to={item.link} className={`group flex items-center gap-4 py-4 hover:bg-slate-100 hover:text-indigo-600 duration-500 cursor-pointer ${isOpen ? 'px-6' : 'justify-center px-1'} ${location.pathname === item.link ? 'text-indigo-600 bg-slate-100' : ''}`}>
              <div className={`w-[36px] h-[36px] text-xl flex justify-center items-center rounded-lg group-hover:bg-indigo-300 group-hover:shadow-md ${location.pathname === item.link ? 'bg-indigo-600 text-white shadow-md group-hover:bg-indigo-600' : ''}`}>{item.icon}</div>
              {isOpen && <span className="text-base">{item.label}</span>}
            </Link>
          </nav>
        ))}
      </div> */}
    </div>
  )
}

export default Sidebar