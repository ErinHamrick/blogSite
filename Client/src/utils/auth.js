import decode from 'jwt-decode';

class AuthService {
	getProfile() {
    const token = this.getToken();
    console.log('Token:', token);

    if (token) {
      return decode(token);
    } else {
      return null; // Return null if the token is not available
    }
  }

	loggedIn() {
		const token = this.getToken();
		// If there is a token and it's not expired, return `true`
		return token && !this.isTokenExpired(token) ? true : false;
	}

	isTokenExpired(token) {
		// Decode the token to get its expiration time that was set by the server
		const decoded = decode(token);
		// If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
		if (decoded.exp < Date.now() / 1000) {
			localStorage.removeItem('id_token');
			return true;
		}
		// If token hasn't passed its expiration time, return `false`
		return false;
	}

	getToken() {
		return localStorage.getItem('id_token');
	}

	login(idToken) {
		console.log('Received Token:', idToken);
		try {
			localStorage.clear();
			localStorage.setItem('id_token', idToken);
			window.location.assign('/blogposts');
		} catch (error) {
			console.error('Error storing token in local storage:', error.message);
		}
	}

	logout() {
		try {
			console.log('Removing Token');
			localStorage.removeItem('id_token');
			window.location.reload();
		} catch (error) {
			console.error(
				'Error removing token from local storage:',
				error.message
			);
		}
	}
}

export default new AuthService();
