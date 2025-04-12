function verifyUserSignup(requestData) {
    $.ajax({
        url: '/user_signup',  
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        beforeSend: function () {
            console.log("Signing up user...");
            $("#signupButton").prop("disabled", true).text("Signing Up...");
        },
        success: function (data) {
            if (data.status === "Signup Successful") {
                console.log("User signed up successfully:", data);
                alert("Signup Successful! Redirecting...");
                window.location.href = '/login'; 
            } else {
                console.error("Signup failed:", data.message);
                alert("Signup Failed: " + data.message);
            }
        },
        error: function (jqXhr, textStatus, errorMsg) {
            console.error("Error during signup:", errorMsg);
            alert("An error occurred during signup: " + errorMsg);
        },
        complete: function () {
            $("#signupButton").prop("disabled", false).text("Sign Up");
        }
    });
}

$(document).on("click", "#signupButton", function (e) {
    e.preventDefault(); 

    const fullName = $("#name").val().trim();
    const email = $("#email").val().trim();
    const password = $("#password").val();
    const confirmPassword = $("#confirm-password").val();
    const role = $("#role").val();


    if (!fullName || !email || !password || !confirmPassword || !role) {
        alert("All fields are required!");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Prepare request data
    const requestData = {
        full_name: fullName,
        email: email,
        password: password,
        role: role
    };

    console.log("Sending signup request:", requestData);

    // Call signup fun..
    verifyUserSignup(requestData);
});

// Function user login
function verifyUserLogin(requestData) {
    $.ajax({
        url: '/user_login',  
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        beforeSend: function () {
            console.log("Logging in user...");
            $("#loginButton").prop("disabled", true).text("Logging in...");
        },
        success: function (data) {
            if (data.status === "Login Successful") {
                console.log("Login successful:", data);
                localStorage.setItem('email', data.email); // Store email
                alert("Login Successful! Redirecting...");
                window.location.href = '/plants';  
            } else {
                console.error("Login failed:", data.message);
                alert("Invalid credentials. Please try again.");
            }
        },
        error: function (jqXhr, textStatus, errorMsg) {
            console.error("Error during login:", errorMsg);
            alert("An error occurred during login. Please try again.");
        },
        complete: function () {
            $("#loginButton").prop("disabled", false).text("Login");
        }
    });
}

$(document).on("click", "#loginButton", function (e) {
    e.preventDefault(); 

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();
    const role = $("#role").val();

    // Basic validation
    if (!email || !password || !role) {
        alert("All fields are required!");
        return;
    }

    // Prepare request data
    const requestData = {
        email: email,
        password: password,
        role: role
    };

    console.log("Sending login request:", requestData);

    // Call login func...
    verifyUserLogin(requestData);
});

function register_login_events(){
    $(document).on("change", "#role", function(e){
        var selectedsingup = $("#role option:selected").val();
    });

$(document).on("click", "#signupButton", function(e){
    var selectedsingup = $("#role option:selected").val();
    var name = $("#name").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var confirmpassword = $("#confirm-password").val();
    verifyUserSignup(selectedsingup,name,email, password,confirmpassword);
});

$(document).on("change", "#role", function(e){
    selectedlogin = $("#role option:selected").val();
if (selectedlogin == "user"){
    $(document).on("click", "#loginButton", function(e){
        var name = $("#name").val();
        var email = $("#email").val();
    
        var request_data = {
            "name" :name,
            "email" : email  
        }
        verifyUserLogin(request_data);
    });
}
else if(selectedlogin == "admin"){
    $(document).on("click", "#loginButton", function(e){
        var name = $("#name").val();
        var email = $("#email").val();

        var request_data = {
            "name" :name,
            "email" : email   
        }
        verifyUserLogin(request_data);
    });
}
});
}

function get_submit_contact_form_data(request_data){
    $.ajax({
        url: '/submit_contact_form',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(request_data),
        beforeSend: function () {
            console.log("Submitting contact form...");
        },
        success: function (response) {
            if (response.status === "Success") {
                console.log("Contact form submitted successfully:", response);
                
                $("#response-message").text("Thank you for contacting us! Your message has been received.").show();
        
                // Wait for 5 seconds, then contactpage
                setTimeout(function () {
                    window.location.href = '/contactPage';
                }, 5000);
            } else {
                console.error("Submission failed:", response.message);
                alert("Failed to submit the form: " + response.message);
            }
        },
        error: function (jqXhr, textStatus, errorMsg) {
            console.error("Error during form submission:", errorMsg);
            alert("An error occurred during submission: " + errorMsg);
        }
    });
}

$(document).on("submit", "#contactForm", function (e) {
    e.preventDefault(); 

    const full_name = $("#name").val();
    const email = $("#email").val();
    const message = $("#message").val();

    const request_data = {
        full_name: full_name,
        email: email,
        message: message
    };
    get_submit_contact_form_data(request_data);
});

$(document).on("click", "#uploadbutton", function(e){
    event.preventDefault(); 
             
    var plantName = $("#plantName").val();
    var productType = $("#productType").val();
    var plantType = $("#plantType").val();
    var plantDescription = $("#plantDescription").val();
    var plantPrice = $("#plantPrice").val();

            var formData = new FormData();
            var plantImage = $("#plantImage")[0].files[0];
                 
            if(plantImage){
                formData.append("plantImage",plantImage);
                formData.append("plantName", plantName);
                formData.append("productType", productType);
                formData.append("plantType", plantType);
                formData.append("plantDescription", plantDescription);
                formData.append("plantPrice", plantPrice);
            
                console.log("Logging FormData contents:");
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }
               
                $.ajax({
                    url: "/upload_image", 
                    type: "POST",
                    data: formData,
                    processData: false, // Prevent jQuery from processing the data
                    contentType: false, // Prevent jQuery from setting a content-type header
                    success: function (response) {
                        alert("Image uploaded successfully!");
                    },
                    error: function (xhr, status, error) {
                        alert("An error occurred: " + error);
                    }
                });
            }       
});

$(document).ready(function () {
    // When the page loads, fetch all data by default
    get_plant_image_data({ selectPlantType: "", selectFertilizerandSeeds: "" });
    get_cart_details_data();
});
$(document).on("change", "#plant-type, #fertilizer-and-seeds", function () {
    const  selectPlantType = $("#plant-type").val();
    const  selectFertilizerandSeeds = $("#fertilizer-and-seeds").val(); 
    
    const request_data = {
        selectPlantType: selectPlantType,
        selectFertilizerandSeeds: selectFertilizerandSeeds
    };
    console.log(request_data)

    get_plant_image_data(request_data);
    get_cart_details_data();
});

function get_plant_image_data(request_data) {
    $.ajax({
        url: '/get_plant_image',  
        type: "POST",             
        dataType: "json",        
        contentType: "application/json", 
        data : JSON.stringify(request_data),
        beforeSend: function () {
            console.log("Fetching data with filter:");
        },
        success: function (data, status, xhr) {
            console.log("Success response from Flask:", data);
            var raw_plant_image_data = data;
            var plant_image_data = JSON.parse(raw_plant_image_data['data']);

            populate_plant_image_data(plant_image_data); 
        },
        error: function (jqXhr, textStatus, errorMsg) {
            console.log("Error fetching data:", errorMsg);
        }
    });
}




// Dynamically load plant image cards
function populate_plant_image_data(plant_image_data) {
    console.log("Received plant image data:", plant_image_data);
    let imageHtml = `<div class="plant-grid">`;

    $.each(plant_image_data, function(index, row) {
        imageHtml += `
        <div class="imageSection">
    <img style="height:200px; width:200px;" alt="base64image" src="data:image/png;base64,${row['plant_images']}">
    <div><strong>Rs: </strong> ${row['price']}</div>
    <button class="action-btn add-to-cart-btn" id="ATC_Btn"
            data-name="${row['plant_name']}" 
            data-price="${row['price']}" 
            data-image="data:image/png;base64,${row['plant_images']}">
        Add To Cart
    </button>
    <a href="/buyNowPage">
        <button class="buy-now" id="BuyNow_Btn"
                data-name="${row['plant_name']}" 
                data-price="${row['price']}" 
                data-image="data:image/png;base64,${row['plant_images']}">
            Buy Now
        </button>
    </a>
</div>`;
    });
}

    imageHtml += `</div>`;
    $("#imageContainer").html(imageHtml);

// Add to cart functionality
$(document).on('click', '.add-to-cart-btn', function () {
    const email_id = localStorage.getItem('email');
    const plantData = {
        email_id: email_id,
        name: $(this).data('name'),
        price: $(this).data('price'),
        image: $(this).data('image'),
        quantity: 1,
        total: $(this).data('price')
    };

    $.ajax({
        url: '/add_cart',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(plantData),
        success: function (response) {
            alert("Plant added to cart!");
            updateCartCount(email_id);
        },
        error: function (err) {
            alert("Failed to add plant to cart.");
            console.error(err);
        }
    });
});

// Load cart data on page load
$(document).ready(function () {
    get_cart_details_data();
    updateCheckoutSummary();
});

// Get cart details
function get_cart_details_data() {
    const email_id = localStorage.getItem('email');

    $.ajax({
        url: '/get_cart_details',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ email_id: email_id }),
        success: function (data) {
            const cart_details_data = JSON.parse(data['data']);
            populate_cart_details_data(cart_details_data);
        },
        error: function (err) {
            console.error("Error fetching cart details:", err);
        }
    });
}

// Populate cart items
function populate_cart_details_data(cart_details_data) {
        console.log("Received data to display:", cart_details_data); 
        let cartHtml = `<div class="cart-container">`;
        let cartCount = 0; 
        
    $.each(cart_details_data, function (index, row) {
        cartHtml += `
            <div class="cart-item" data-id="${row.id}">
                <img src="${row.plant_image}" alt="${row.plant_name}" style="width:100px; height:100px;">
                <div class="item-details">
                    <h3>${row.plant_name}</h3>
                    <p>Price: ${row.price}</p>
                    <div class="quantity">
                        <button class="decrease-qty" data-id="${row.id}"data-price="${row.price}">-</button>
                        <input type="number" class="item-qty" value="${row.quantity}" data-id="${row.id}" readonly>
                        <button class="increase-qty" data-id="${row.id}" data-price="${row.price}">+</button>
                    </div>
                    <p>Subtotal:<span class="item-total" id = "item--total" data-id="${row.id}">${row.total_price}</span></p>
                    <button class="remove-item" data-id="${row.id}">Remove</button>
                    
                </div>    
            </div>`;
        cartCount++;
    });
    
    cartHtml += `</div>
            <div class="cart-summary">
                <p><span class="currency">Total: </span> <span id="cart-subtotal">0</span></p>
                <a href= "/buyNowPage"><button class="buynow" id="Checkout_Btn">Checkout</button></a>
            </div>`;
    $(".cart-container").html(cartHtml);
    $(".cart-icon span").text(cartCount); 
       
      calculateSubtotal();
    }


// Update subtotal
function calculateSubtotal() {
    let subtotal = 0;

    $(".item-total").each(function () {
        subtotal += parseFloat($(this).text().trim()) || 0;
    });

    localStorage.setItem('checkout_total', subtotal.toFixed(2));
    $("#cart-subtotal").text(subtotal.toFixed(2));
}

// Quantity adjustment
$(document).on('click', '.increase-qty, .decrease-qty', function () {
    const isIncrease = $(this).hasClass("increase-qty");
    const itemId = $(this).data("id");
    const price = $(this).data("price");
    const $qtyInput = $(`.item-qty[data-id="${itemId}"]`);
    const $totalEl = $(`.item-total[data-id="${itemId}"]`);
    let quantity = parseInt($qtyInput.val());

    quantity = isIncrease ? quantity + 1 : Math.max(1, quantity - 1);
    $qtyInput.val(quantity);
    $totalEl.text((price * quantity).toFixed(2));

    calculateSubtotal();
});

// Remove item
$(document).on("click", ".remove-item", function () {
    const itemId = $(this).data("id");

    $.ajax({
        url: '/get_remove_cart_item',
        type: 'POST',
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify({ itemId: itemId }),
        success: function () {
            $(`.cart-item[data-id="${itemId}"]`).remove();
            updateCartSummary();
            calculateSubtotal();
        },
        error: function (err) {
            console.error("Error removing item:", err);
        }
    });
});

// Update cart icon count
function updateCartSummary() {
    const cartCount = $(".cart-item").length;
    $(".cart-icon span").text(cartCount);
}

// Buy Now
$(document).on('click', '.buy-now-btn', function () {
    const plantItem = {
        name: $(this).data('name'),
        price: $(this).data('price'),
        image: $(this).data('image')
    };
    localStorage.setItem('checkout_items', JSON.stringify([plantItem]));
    window.location.href = "/buyNowPage";
});

// Checkout button
$(document).on('click', '#Checkout_Btn', function () {
    let cartItems = [];

    $(".cart-item").each(function () {
        cartItems.push({
            name: $(this).find(".item-name").text(),
            price: $(this).find(".item-total").text(),
            image: $(this).find("img").attr("src")
        });
    });

    localStorage.setItem('checkout_items', JSON.stringify(cartItems));
    window.location.href = "/buyNowPage";
});

// Order summary on checkout page
function updateCheckoutSummary() {
    const container = $("#checkout-summary-container");
    container.empty().removeClass("d-none");

    const checkoutItems = JSON.parse(localStorage.getItem('checkout_items')) || [];
    let totalPrice = 0;

    checkoutItems.forEach(item => {
        container.append(`
            <div class="order-summary-item">
                <img src="${item.image}" alt="${item.name}" class="summary-image">
                <p><strong>${item.name}</strong></p>
                <p>Price: ₹<span class="cart_total">${item.price}</span></p>
            </div>
        `);
        totalPrice += parseFloat(item.price);
    });

    $("#final-price-display").html(`Total: ₹${totalPrice.toFixed(2)}`);
}

// Form submission on checkout
$(document).on("submit", "#checkoutForm", function (e) {
    e.preventDefault();

    const request_data = {
        email_or_phone: $("#email").val(),
        news_offers_subscription: $("#newsOffers").is(":checked"),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        address: $("#address").val(),
        apartment_details: $("#apartmentDetails").val(),
        city: $("#city").val(),
        state: $("#state").val(),
        pin_code: $("#pin_code").val(),
        phone_number: $("#phone").val()
    };

    get_submit_order_details_data(request_data);
});

// Submit order to backend
function get_submit_order_details_data(request_data) {
    $.ajax({
        url: '/submit_order_details',
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(request_data),
        success: function (response) {
            if (response.status === "Success") {
                $("#response-message").text("Thank you! Your order has been placed.").show();
                
                // ✅ Redirect to homepage after 3 seconds
                setTimeout(() => {
                    window.location.href = '/HomePage';
                }, 3000);
            } else {
                alert("Order submission failed: " + response.message);
            }
        },
        error: function (err) {
            alert("Submission error: " + err.statusText);
        }
    });
}



document.addEventListener("DOMContentLoaded", function () {
    const seasonalTips = [
        "🌱 January:\n- Watering: Reduce watering.\n- Sunlight: Use south-facing windows.\n- Fertilizing: Avoid – plants are dormant.",
        "🌱 February:\n- Watering: Slightly increase watering.\n- Sunlight: Clean leaves.\n- Fertilizing: Light feeding.",
        "🌱 March:\n- Watering: Increase.\n- Sunlight: Bright spots.\n- Fertilizing: Start regular feeding.",
        "🌱 April:\n- Watering: Regular schedule.\n- Sunlight: Gradual spring exposure.\n- Fertilizing: Nitrogen-rich fertilizer.",
        "🌱 May:\n- Watering: Morning is best.\n- Sunlight: Avoid midday heat.\n- Fertilizing: Phosphorus-rich for blooms.",
        "🌱 June:\n- Watering: Deep, infrequent.\n- Sunlight: Provide partial shade.\n- Fertilizing: Moderate feeding.",
        "🌱 July:\n- Watering: Early or late.\n- Sunlight: Use shades.\n- Fertilizing: Monthly feeding.",
        "🌱 August:\n- Watering: Keep soil moist.\n- Sunlight: Reduce exposure.\n- Fertilizing: Reduce frequency.",
        "🌱 September:\n- Watering: Decrease.\n- Sunlight: Use bright windows.\n- Fertilizing: Low-nitrogen type.",
        "🌱 October:\n- Watering: Moist soil.\n- Sunlight: Bright indoor spots.\n- Fertilizing: Pause feeding.",
        "🌱 November:\n- Watering: Minimal.\n- Sunlight: Maximize light.\n- Fertilizing: Stop feeding.",
        "🌱 December:\n- Watering: Lukewarm water.\n- Sunlight: Artificial light if needed.\n- Fertilizing: Avoid it."
    ];

    const tip = seasonalTips[new Date().getMonth()];
    const tipContainer = document.getElementById("seasonal-tip");
    if (tipContainer) {
        tipContainer.textContent = tip;
    }
});


// document.addEventListener("DOMContentLoaded", function () {
//     const seasonalTips = [
//         "🌱 January:\n- Watering: Reduce watering frequency.\n- Sunlight: Use south-facing windows.\n- Fertilizing: Avoid – plants are dormant.",
//         "🌱 February:\n- Watering: Slightly increase watering.\n- Sunlight: Clean leaves, maximize light.\n- Fertilizing: Start light feeding.",
//         "🌱 March:\n- Watering: Increase watering.\n- Sunlight: Move to brighter spots.\n- Fertilizing: Begin regular feeding.",
//         "🌱 April:\n- Watering: Maintain regular watering.\n- Sunlight: Gradually introduce spring sun.\n- Fertilizing: Use nitrogen-rich fertilizer.",
//         "🌱 May:\n- Watering: Water more frequently.\n- Sunlight: Avoid harsh midday rays.\n- Fertilizing: Phosphorus-rich for flowers.",
//         "🌱 June:\n- Watering: Deep watering, less frequent.\n- Sunlight: Provide partial shade.\n- Fertilizing: Light feeding.",
//         "🌱 July:\n- Watering: Early morning/evening.\n- Sunlight: Use shades if needed.\n- Fertilizing: Once every 4 weeks.",
//         "🌱 August:\n- Watering: Maintain moisture, avoid sogginess.\n- Sunlight: Reduce harsh sun.\n- Fertilizing: Reduce feeding.",
//         "🌱 September:\n- Watering: Reduce frequency.\n- Sunlight: Use bright windows.\n- Fertilizing: Low-nitrogen fertilizer.",
//         "🌱 October:\n- Watering: Keep slightly moist.\n- Sunlight: Move plants indoors.\n- Fertilizing: Pause feeding.",
//         "🌱 November:\n- Watering: Minimal. Ensure airflow.\n- Sunlight: Clean windows.\n- Fertilizing: Stop fertilizing.",
//         "🌱 December:\n- Watering: Minimal with lukewarm water.\n- Sunlight: Use windows or lights.\n- Fertilizing: Avoid it."
//     ];

//     const tipContainer = document.getElementById("seasonal-tip");
//     if (tipContainer) {
//         const currentMonth = new Date().getMonth(); // 0 = January
//         tipContainer.innerText = seasonalTips[currentMonth];
//     }

//     // Dropdown Menu Toggle (optional)
//     const dropdownBtn = document.querySelector(".dropdown-btn");
//     const dropdownContent = document.querySelector(".dropdown-content");

//     if (dropdownBtn && dropdownContent) {
//         dropdownBtn.addEventListener("click", function (event) {
//             event.stopPropagation();
//             dropdownContent.classList.toggle("show");
//         });

//         document.addEventListener("click", function () {
//             dropdownContent.classList.remove("show");
//         });
//     }
// });
