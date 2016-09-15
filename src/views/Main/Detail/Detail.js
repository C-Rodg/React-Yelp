import React, { PropTypes as T } from 'react';
import classnames from 'classnames';
import {getDetails} from 'utils/googleApiHelpers';

import styles from './styles.module.css';

export class Detail extends React.Component {
	static childContextTypes = {
		router: T.object
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			loading: true,
			place: {},
			location: {}
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.map && (prevProps.map !== this.props.map || prevProps.params.placeId !== this.props.params.placeId)) {
			this.getDetails(this.props.map);
		}
	}

	componentDidMount() {
		if (this.props.map) {
			this.getDetails(this.props.map);
		}
	}

	getDetails(map) {
		const {google, params} = this.props;
		const {placeId} = params;

		this.setState({loading: true}, () => {
			getDetails(google, map, placeId)
			.then((place) => {
				const {location} = place.geometry;
				const loc = {
					lat: location.lat(),
					lng: location.lng()
				};

				this.setState({
					place, 
					location: loc, 
					loading: false
				});
			})
		});
	}

	renderOpen(place) {
		if(place.opening_hours.open_now) {
			return (<span className={styles.open}>Open!  : )</span>)
		} else {
			return (<span className={styles.closed}>Closed : (</span>)
		}
	}

	renderReviews(reviews) {
		if (!reviews || reviews.length == 0) {
			return ("<p>No reviews yet..</p>");
		}
		return (
			<div>{	
				reviews.map(r => {
					return (
						<div className={styles.reviewBox}>
							<p className={styles.reviewRate}>{r.rating}.0 Rating</p>
							<p>{r.text}</p>
							<p>-{r.author_name}</p>
						</div>
					)
				})
			}</div>
		)
	}

	renderPhotos(place) {
		if(!place.photos || place.photos.length == 0) {
			return ("<p>No photos..</p>");
		}
		const cfg = {maxWidth: 100, maxHeight: 100};
		return (
			<div className={styles.photoStrip}>
				{place.photos.map(p => {
					const url = `${p.getUrl(cfg)}.png`;
					return (<img key={url} src={url} />)
				})}
			</div>
		)
	}

	render() {
		if (this.state.loading) {
			return (
				<div className={styles.details}>
					Loading...
				</div>
			);
		}
		const {place} = this.state;
		return (
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<h2>{place.name}</h2>
					<h4>{place.formatted_address} | <a href="#">{place.formatted_phone_number}</a></h4>
				</div>
				<div className={styles.details}>
					{this.renderPhotos(place)}
				</div>
				<div className={styles.price}>
					<h4>Price: {function(place){
						let str = "";
						for(let i = 0; i < place.price_level; i++){
							str += "$ ";
						}
						return str;
					}(place)}</h4>
				</div>
				<div className={styles.hours}>
					<h4>Hours:</h4>
					<p>We're... {this.renderOpen(place)}</p>
					<ul>
					{place.opening_hours.weekday_text.map(p => {
						return (
							<li>{p}</li>
						)
					})}
					</ul>
				</div>
				<div className={styles.reviews}>
					<h4>Reviews:</h4>
					{this.renderReviews(place.reviews)}
				</div>
			</div>
		)
		
	}
}

export default Detail