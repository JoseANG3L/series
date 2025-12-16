import { Search, Play, Bookmark, Facebook, Twitter, Instagram, Heart, Mail } from 'lucide-react';
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-12">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 tracking-tighter cursor-pointer">
            LUISFSERIES
        </h1>
        <ul className="hidden md:flex gap-8 font-medium text-sm">
            <NavLink to="/" end className={({ isActive }) => isActive ? "text-red-500" : "text-gray-300 hover:text-red-500 transition"}>
            Home
            </NavLink>
            <NavLink to="/peliculas" end className={({ isActive }) => isActive ? "text-red-500" : "text-gray-300 hover:text-red-500 transition"}>
            Peliculas
            </NavLink>
            {/* <li className="cursor-pointer hover:text-white transition">Peliculas</li>
            <li className="cursor-pointer hover:text-white transition">Movie Release</li>
            <li className="cursor-pointer hover:text-white transition">Forum</li> */}
        </ul>
        </div>

        <div className="flex items-center gap-6">
        <button className="text-white hover:text-red-500 transition">
            <Search className="w-6 h-6" />
        </button>
        <button className="hidden md:block px-5 py-2 border border-gray-500 text-white rounded-full text-sm font-semibold hover:border-white transition">Sign up</button>
        <button className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-500 shadow-lg shadow-green-900/50 transition">Login</button>
        </div>
    </nav>
    );
};

export default Navbar;