import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      {' | '}
      <Link to="/companies">Companies</Link>
      {' | '}
      <Link to="/dsa">DSA</Link>
      {' | '}
      <Link to="/interviews">Interviews</Link>
      {' | '}
      <Link to="/projects">Projects</Link>
    </nav>
  )
}

export default Navbar