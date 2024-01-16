import React from 'react';
import { Link, } from 'react-router-dom';
import Auth from '../utils/auth';
   
const Header = () => {
  console.log('Header component rendering...');
   // Testing local storage
  //  localStorage.setItem('test_key', 'test_value');
  //  const testValue = localStorage.getItem('test_key');
  //  console.log('Test Value:', testValue);
  

  const renderAuthenticatedContent = () => {
    if (Auth.loggedIn()) {
      const username = Auth.getProfile().data.username;

      return (
        <>
          <Link className="username-button" to={`/profile/${username}`}>
            {username}
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      );
    }

    return null;
  };

  const handleLogout = (event) => {
    event.preventDefault();
    Auth.logout();
    window.location.assign('/');
  };

  return (
    <header className='main-header'>
      <div>
        <div className='site-name gradient-text'>
          <h1>Random Ramblings</h1>
        </div>
        <div className='username-logout-buttons'>
          {renderAuthenticatedContent()}
        </div>
      </div>
    </header>
  );
};

export default Header;


// import { Link } from 'react-router-dom';
// import Auth from '../utils/auth';

// const Header = () => {
//   console.log('Header component rendering...');
//   const logout = (event) => {
//     event.preventDefault();
//     Auth.logout();
//     window.location.assign('/HomePage');
//   };

//   return (
//     <header className='main-header'>
//       <div >
//       <div className='site-name gradient-text'>
//         <h1>Random Ramblings</h1>
//       </div>
//          <div className='username-logout-buttons'>
//           {Auth.loggedIn() ? (
//             <>
//               <Link className="username-button" to="/Profile">
//                 {Auth.getProfile().data.username}
//               </Link>
//               <button className="logout-button" onClick={logout}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
