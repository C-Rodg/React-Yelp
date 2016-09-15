import React, {PropTypes as T} from 'react';
import classnames from 'classnames';
import Map, { GoogleApiWrapper, Marker } from 'google-maps-react';
import styles from './styles.module.css';

export class MapComponent extends React.Component {
	_renderChildren() {
		const {children} = this.props;

		if(React.Children.count(children) > 0) {
			return React.Children.map(children, c => {
				return React.cloneElement(c, this.props, {
					map: this.props.map,
					google: this.props.google
				})
			})
		} else {
			return this._renderMarkers();
		}
	}
	_renderMarkers() {
		if(!this.props.places) {
			return;
		}
		return this.props.places.map(place => {
			return <Marker key={place.id}
						name={place.id}
						place={place}
						label={place.name}
						onClick={this.props.onMarkerClick.bind(this)}
						map={this.props.map}
						position={place.geometry.location}
					/>
		});
	}
	render() {
		let where = {
			lat: 47.615796,
			lng: -122.3198484
		};
		const {children} = this.props;
		return (
			<Map 
				map={this.props.map}
				google={this.props.google}
				className={styles.map}
				zoom={this.props.zoom}
				center={where}
				onRecenter={this.props.onMove}
				onDragend={this.props.onMove}
				onClick={this.props.onClick}
				visible={!children || React.Children.count(children) == 0}
				>
				{this._renderChildren()}
			</Map>
		)
	}
}

MapComponent.propTypes = {
	onMarkerClick: T.func
};

const identity = (...a) => a;
MapComponent.defaultProps = {
	onMarkerClick: identity
};

export default MapComponent