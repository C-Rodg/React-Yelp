import React from 'react';
import {Link} from 'react-router';

import styles from './styles.module.css';

export class Header extends React.Component {
	render() {
		return (
			<div className={styles.topbar}>
				<Link to="/" className={styles.logo}><h1>Welp</h1></Link>
				<section>
					CurtisRodgers.com
				</section>
			</div>
		)
	}
}

export default Header;