<script>
	import Map from '$lib/Mapbox.svelte';
	import Legend from '$lib/Legend.svelte';
	import Button from '$lib/Button.svelte';
	import Slider from 'svelte-range-slider-pips';
	import Chart from '$lib/Bchart.svelte';
	import yearTotals from '../year_totals.json';
	// import Content from '$lib/Content.svelte';
	// import Modal from 'svelte-simple-modal';
	import chroma from 'chroma-js';
	import { base_colors, coordinates, year_min, year_max, bounds } from '../consts';

	let yeardiff = year_max - year_min;
	let palette = chroma.bezier(base_colors).scale().correctLightness().colors(60);

	for (let i = 60; i < yeardiff; i++) {
		palette.push(palette[59]);
	}

	let map_palette = [];
	for (let i = 0; i < palette.length; i++) {
		map_palette.push(i);
		map_palette.push(palette[i]);
	}
	let map_palette_single = map_palette[11];

	let map_palette_sg = ['sg', '#E6007E'];

	let year = [1970];
	let single = false;
	let secondgrowth = false;

	let data_year;
	$: data_year = yearTotals.filter(function (x) {
		return x.year == year;
	});

	let data_total;
	$: data_total = yearTotals.filter(function (x) {
		return x.year <= year;
	});

	let totals;
	$: totals = data_total.map(function (el) {
		return Math.round(el.area, 1);
	});

	let logged_total;
	$: logged_total = numberWithCommas(sumValues(totals));

	let logged_year;
	$: if (data_year[0]) {
		logged_year = numberWithCommas(data_year[0].area);
	} else {
		logged_year = 0;
	}

	function sumValues(numbers) {
		var x = numbers.reduce(function (prev, curr) {
			return curr + prev;
		}, 0);
		return x;
	}

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	function toggleSingle() {
		single = !single;
	}

	function toggleSecondgrowth() {
		console.log('hi');
		secondgrowth = !secondgrowth;
	}

	function addYear() {
		if (year != year_max) {
			year++;
		}
	}

	function minusYear() {
		if (year != year_min) {
			year--;
		}
	}
</script>

<header
  class="invisible absolute py-1 w-full bg-black text-gray-400 text-lg p-5
  bg-opacity-75 sm:visible" style="z-index: 2;">
  <span class="text-2xl text-gray-500">75 years</span>
				<span class="text-xl text-gray-500">of</span>
				<span class="text-2xl text-gray-500">logging</span>
				<span class="text-xl text-gray-700">in</span>
				<span class="text-2xl text-gray-500">Little Slocan</span>
    <!-- <Modal >
      <ModalAbout />
    </Modal> -->
  <div class = "absolute top-0 right-0 p-5 text-xs">
    <span class="text-gray-900 pr-1" >developed by </span>
    <a href="https://www.northbeachconsulting.ca" class="hover:no-underline hover:text-blue-600" target="_blank">North Beach Consulting</a>
  </div>
</header>

<div class="flex absolute bottom-0 w-full md:w-6/12 lg:w-6/12 xl:w-6/12" style="height: 50%;">
  <div class="w-full bg-black bg-opacity-75 p-2" style="z-index: 1;">
   
    <div class="text-center flex justify-center">
      <Button outline={false} caption={'-'} on:minus-year={minusYear} />
      <div class="inline-block">
        <p class="text-5xl text-gray-500">{year}</p>
      </div>
      <Button outline={false} caption={'+'} on:add-year={addYear} />
    </div>

    <div class="px-20 w-auto">
		<Slider bind:values={year} min={1945} max={2022} pips step={1} pipstep={10} />
    </div>
	
	<div class="text-center text-gray-400">
		<!-- <span class="text-2xl text-green-700">{logged_year}</span>
		<span class="text-lg text-gray-700">hectares logged in</span>
		<span class="text-2xl text-gray-500">{year}</span>
		<br /> -->
		<span class="text-2xl text-green-700">{logged_total}</span>
		<span class="text-lg text-gray-700">hectares logged from</span>
		<span class="text-2xl text-gray-500">1945</span>
		<span class="text-lg text-gray-700">to</span>
		<span class="text-2xl text-gray-500">{year}</span>
	</div>
    <div style="height: 12rem;">
		<Chart {year} {year_min} {data_total} {map_palette} {palette} />
    </div>

  </div>
</div>

<div class=" absolute sm:my-10  p-0 md:p-2 rounded-lg bg-black bg-opacity-75 text-gray-400" style="z-index: 1; ">
  <Legend {palette} {single} {secondgrowth} {map_palette_single} {map_palette_sg}/>
</div>

<Map {year} {single} {secondgrowth} {map_palette} {map_palette_single} {map_palette_sg} {bounds} />


<style>
	a {
		color: #4a5568;
	}
	.rangeSlider {
		color: #a0aec0;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 2fr 3fr;
		grid-gap: 0px;
	}
</style>
