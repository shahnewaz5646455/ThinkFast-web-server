import React, { use } from "react";
import { FiLogIn, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { setDarkMode, darkMode, user, logout } = use(AuthContext);
  const damyphoto =
    "https://i.postimg.cc/HWwKx0JW/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg";

  // Theme toggle button
  const ThemeToggle = () => (
    <button
      className="btn btn-ghost btn-circle text-xl"
      onClick={handledark}
      aria-label="Toggle Theme"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? (
        <FiSun className="text-yellow-400 transition-transform duration-300 scale-110" />
      ) : (
        <FiMoon className="text-primary transition-transform duration-300 scale-110" />
      )}
    </button>
  );

  const handledark = () => {
    setDarkMode(!darkMode);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Logout failed!");
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/Assignments" className="font-medium">
          <MdAssignmentTurnedIn className="inline-block text-lg mr-1" />
          Assignments
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/pending" className="font-medium">
              Pending
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="font-semibold border-2 ">
              <FiLogOut className="inline-block mr-1 text-lg " />
              Logout
            </button>
          </li>
        </>
      )}
    </>
  );
  console.log(darkMode);
  return (
    <div className="bg-base-100 shadow-md sticky top-0 z-50">
      {/* Drawer toggle on small screen */}
      <div className="drawer md:hidden">
        <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-between p-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-white tracking-widest">
                <span className={`${darkMode ? "text-black" : "text-white"}`}> Group</span>
                <span className="text-orange-400">Study</span>
              </span>
            </div>
          </Link>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <label htmlFor="nav-drawer" className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
        </div>

        <div className="drawer-side z-40">
          <label htmlFor="nav-drawer" className="drawer-overlay"></label>
          <ul
            className="menu p-4 w-64 bg-base-200 space-y-2 h-screen md:h-auto flex flex-col"
            style={{ minHeight: "100vh" }} // Ensures full height on all devices
          >
            {navLinks}
            {user ? (
              <li className="mt-4 border-t pt-4">
                <div className="dropdown dropdown-bottom">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar flex justify-start"
                  >
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={user.photoURL || damyphoto}
                        alt="profile"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = damyphoto;
                        }}
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li className="text-center font-semibold">
                      {user.displayName}
                    </li>
                    <li>
                      <NavLink to="/CreateAssignment">
                        Create Assignments
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/mysubmission">My Assignments</NavLink>
                    </li>
                    <li>
                      <button onClick={handleLogout}>
                        <FiLogOut className="inline-block mr-1" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            ) : (
              <li className="mt-4 space-y-2 border-t pt-4">
                <Link to="/login" className="btn text-white  btn-primary ml-4">
                  <FiLogIn className="mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn text-white btn-primary ml-4"
                >
                  <FiLogIn className="mr-1" />
                  Register
                </Link>
              </li>
            )}
            {/* Add a nice gradient or divider for beauty */}
            <div className="mt-auto">
              <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary rounded"></div>
              <p className="text-xs text-center text-base-content mt-4 opacity-70">
                &copy; {new Date().getFullYear()} GroupStudy
              </p>
            </div>
          </ul>
        </div>
      </div>

      {/* Full navbar for large screens */}
      <div className="navbar hidden md:flex px-6">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-primary">
            <div></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <polygon points="11,3 20,19 2,19" fill="#184445" />
                </svg>
              </span>
              <span className="text-2xl font-bold text-white tracking-widest">
                <span className={`${darkMode? "text-black":"text-white"}`}> Group</span>
                <span className="text-orange-400">Study</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex-none flex items-center gap-2">
          <ThemeToggle />
          <ul className="menu menu-horizontal px-1 gap-3">{navLinks}</ul>
          {!user ? (
            <>
              <Link to="/login" className="btn text-white btn-primary ml-4">
                <FiLogIn className="mr-1" />
                Login
              </Link>
              <Link to="/register" className="btn text-white btn-primary ml-4">
                <FiLogIn className="mr-1" />
                Register
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end ml-4 ">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={user.photoURL || damyphoto}
                    alt="profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = damyphoto;
                    }}
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="text-center font-semibold">
                  {user.displayName}
                </li>
                <li>
                  <NavLink to="/CreateAssignment">Create Assignments</NavLink>
                </li>
                <li>
                  <NavLink to="/mysubmission">My Assignments</NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
