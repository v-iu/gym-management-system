function Navbar({ currentPage, setCurrentPage }) {

  const navItem = (page, label) => {
    const isActive = currentPage === page;

    return (
      <button
        onClick={() => setCurrentPage(page)}
        className="relative px-3 py-1 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
      >
        {label}

        <span
          className={`absolute left-0 -bottom-1 h-[2px] bg-[#39FF14] transition-all duration-300
            ${isActive ? "w-full" : "w-0"}
          `}
        />
      </button>
    );
  };

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-center gap-8 py-4">
        {navItem("home", "Home")}
        {navItem("members", "Members")}
        {navItem("staff", "Staff Login")}
      </div>
    </nav>
  );
}

export default Navbar;

