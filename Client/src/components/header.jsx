import { Link } from 'react-router-dom';
import Auth from '../utils/auth';

const Header = () => {
  console.log('Header component rendering...');
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    window.location.assign('/HomePage');
  };

  return (
    <header className='main-header'>
      <div >
      <div className='site-name gradient-text'>
        <h1>Random Ramblings</h1>
      </div>
         <div className='username-logout-buttons'>
          {Auth.loggedIn() ? (
            <>
              <Link className="username-button" to="/Profile">
                {Auth.getProfile().data.username}
              </Link>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
