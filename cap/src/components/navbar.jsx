import { Link } from "react-router-dom"

export default function Navbar() {
    

    return(
        <>

        <div className="navbar1">
            <Link to='/'>Home </Link>
            <Link to='/Watchlist'>Watchlist</Link>
        </div>

        <div className="navbar2">
            <Link to='/Account'>Account </Link>
            <Link to='/Register'>Register </Link>
            <Link to='/Login'>Login </Link>
        </div>

        </>
    )
}