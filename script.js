
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".top-banner form");
    const input = document.querySelector(".top-banner input");
    const msg = document.querySelector(".top-banner .msg");
    const list = document.querySelector(".ajax-section .cities");

    const apiKey = "2239f21021d423c0dabb61432a0b4d2a"; // Replace with your actual API key

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputVal = input.value.trim();

        // Check if the city is already in the list
        const listItems = Array.from(list.querySelectorAll(".city"));
        const cityExists = listItems.some((el) => {
            const cityName = el.querySelector(".city-name span").textContent.toLowerCase();
            const country = el.querySelector(".city-name sup").textContent.toLowerCase();
            return inputVal.toLowerCase() === `${cityName},${country}` || inputVal.toLowerCase() === cityName;
        });

        if (cityExists) {
            msg.textContent = `You already know the weather for ${inputVal}. Please be more specific if there are multiple cities with the same name.`;
            form.reset();
            input.focus();
            return;
        }

        // Fetch weather data
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            msg.textContent = "Please search for a valid city";
            setTimeout(() => {msg.textContent = "";}, 1500);
        } finally {
            form.reset();
            input.focus();
        }
    });

    function displayWeather(data) {
        const { main, name, sys, weather } = data;
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

        const li = document.createElement("li");
        li.classList.add("city");

        const markup = `
            <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}" alt="${weather[0]["main"]}">
                <figcaption>${weather[0]["description"]}</figcaption>
            </figure>
        `;

        li.innerHTML = markup;
        list.appendChild(li);
    }
});
