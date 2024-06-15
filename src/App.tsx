import { useEffect, useRef, useState } from 'react';
import Detail from './components/detail/Detail';
import Forecast from './components/forecast/Forecast';
import Layout from './components/layout/Layout';
import Location from './components/location/Location';
import Weather from './components/weather/Weather';

function App() {
	const [location, setLocation] = useState('Thailand');
	const [searchLocation, setSearchLocation] = useState('');
	const [weather, setWeather] = useState({
		temp: 1,
		minTemp: 2,
		maxTemp: 3,
		condition: '',
		conditionIcon: '',
	});

	const searchRef = useRef<HTMLParagraphElement>(null);

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			enterSearch();
		} else if (event.key === 'Backspace') {
			deleteSearch();
		} else {
			switch (event.key) {
				case 'Shift':
				case 'Caplock':
				case 'Alt':
				case 'Meta':
				case 'Control':
					break;
				default:
					return concatSearch(event.key);
			}
		}
	};

	const concatSearch = (char: string) =>
		setSearchLocation((prev) => `${(prev += char)}`);

	const deleteSearch = () =>
		setSearchLocation((prev) => prev.substring(0, prev.length - 1));

	const enterSearch = () => {
		setLocation(searchRef.current ? searchRef.current.innerText : '');
		setSearchLocation('');
	};

	const fetchData = async () => {
		console.log('fetch data');
		fetch(
			`http://api.weatherapi.com/v1/forecast.json?key=13671897a0e14ef0a06194622241406&q=${location}`
		)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				// console.log('data', data);
				const { location, current, forecast } = data;
				const { forecastday } = forecast;
				const { day } = forecastday[0];
				const { condition } = current;

				console.log('day', day);

				setWeather({
					temp: current.temp_c,
					minTemp: day.mintemp_c,
					maxTemp: day.maxtemp_c,
					condition: condition.text,
					conditionIcon: condition.icon,
				});
			})
			.catch((error) => console.log('error', error));
	};

	useEffect(() => {
		console.log('mounting');
		fetchData();
	}, []);

	return (
		<Layout>
			<Location
				location={location}
				searchLocation={searchLocation}
				searchRef={searchRef}
			/>
			<Weather weather={weather} />
			<Forecast />
			<Detail />
		</Layout>
	);
}

export default App;
