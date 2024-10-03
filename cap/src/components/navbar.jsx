import { Link } from "react-router-dom"

export default function Navbar() {
    

    return(
        <>
        <div className="navbar">

            <Link to='/view' className="navlink">View </Link>
            <Link to='/Watchlist' className="navlink">Watchlist </Link>
            <Link to='Reviews' className="navlink">Reviews </Link>
            <Link to='/Account' className="navlink">Account </Link>
            <Link to='/Register' className="navlink">Register </Link>
            <Link to='/Login' className="navlink">Login </Link>

        </div>
        </>
    )
}