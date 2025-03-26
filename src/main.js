// Constants
const API_URL = 'http://localhost:9000/products';
const PRODUCTS_PER_PAGE = 6;

// State
let currentPage = 1;
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const loadMoreButton = document.getElementById('loadMore');
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');

// Add your implementation here 