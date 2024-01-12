import React from "react";
import Signup from "../components/signup";
import Login from "../components/login";
import Header from '../components/header'


function Home() {
	return (
		<main>
			<Header />
			<div className='background-container'>
				<div>
					<Signup />
				</div>
				<div>
					<Login />
				</div>
			</div>
		</main>
	);
}
export default Home;
