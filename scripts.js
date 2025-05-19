// Изначальный список автомобилей с расходами
const vehicles = {
    "КамАЗ-5350": 46,
    "КамАЗ-5511": 41,
    "КамАЗ-4310": 46,
    "КамАЗ-53949": 40.2,
    "Урал-4320": 44.5,
    "УАЗ-3163-103": 16.4,
    "УАЗ-3962": 17.5,
    "ГАЗ-233014": 25,
    "ГАЗ-233115": 33,
    "Volkswagen 7HC Caravella": 10.2,
    "Титан": 40.2,
    "Феникс": 40.2,
    "Урал-2-оси": 40,
    "КамАЗ-63501": 62
};

// Переключение вкладок
document.querySelectorAll('.tab-link').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const tabId = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    });
});

// Обновляем отображение процента при изменении ползунка
document.getElementById('percentage').addEventListener('input', function() {
    document.getElementById('percentageValue').innerText = this.value + "%";
});

// Функция для расчета расхода топлива
function calculateFuelConsumption(startMileage, endMileage, engineHours, engineFuel, vehicleType, percentage) {
    const mileage = endMileage - startMileage;

    const baseFuelConsumption = mileage * (vehicles[vehicleType] / 100);
    const engineHoursFuel = engineHours * engineFuel;

    let totalFuelConsumption = baseFuelConsumption + (baseFuelConsumption * (percentage / 100)) + engineHoursFuel;

    // Округление в большую сторону, если дробная часть >= 0.5
    if (totalFuelConsumption % 1 >= 0.5) {
        totalFuelConsumption = Math.ceil(totalFuelConsumption);
    } else {
        totalFuelConsumption = Math.floor(totalFuelConsumption);
    }

    return { totalFuelConsumption, mileage };
}

// Обработчик расчета расхода топлива
document.getElementById('calculateBtn').addEventListener('click', () => {
    const startMileage = parseFloat(document.getElementById('startMileage').value);
    const endMileage = parseFloat(document.getElementById('endMileage').value);
    const engineHours = parseFloat(document.getElementById('engineHours').value);
    const engineFuel = parseFloat(document.getElementById('engineFuel').value);
    const vehicleType = document.getElementById('vehicleType').value;
    const percentage = parseFloat(document.getElementById('percentage').value);

    const result = calculateFuelConsumption(startMileage, endMileage, engineHours, engineFuel, vehicleType, percentage);

    document.getElementById('result').innerText = `Общий расход топлива составит ${result.totalFuelConsumption} литров на ${result.mileage} км.`;
});

// Функция для добавления нового автомобиля
document.getElementById('addVehicleBtn').addEventListener('click', () => {
    const newVehicleName = document.getElementById('newVehicleName').value;
    const newVehicleConsumption = parseFloat(document.getElementById('newVehicleConsumption').value);

    if (newVehicleName && !isNaN(newVehicleConsumption)) {
        vehicles[newVehicleName] = newVehicleConsumption;

        // Обновляем выпадающий список
        const option = document.createElement('option');
        option.value = newVehicleName;
        option.textContent = `${newVehicleName} (${newVehicleConsumption} л/100 км)`;

        // Добавляем новый автомобиль в оба выпадающих списка
        document.getElementById('vehicleType').appendChild(option);
        document.getElementById('vehicleTypePlan').appendChild(option.cloneNode(true));

        alert("Автомобиль успешно добавлен!");
    } else {
        alert("Пожалуйста, заполните все поля правильно!");
    }
});

// Расчет планирования маршрута
document.getElementById('planRouteBtn').addEventListener('click', () => {
    const distance = parseFloat(document.getElementById('distance').value);
    const vehicleType = document.getElementById('vehicleTypePlan').value;
    const tankVolume = parseFloat(document.getElementById('tankVolume').value);

    const fuelPer100Km = vehicles[vehicleType];
    const totalFuelRequired = (distance / 100) * fuelPer100Km;

    const roundedFuelRequired = totalFuelRequired % 1 >= 0.5 ? Math.ceil(totalFuelRequired) : Math.floor(totalFuelRequired);
    const refuelsRequired = totalFuelRequired / tankVolume;
    const roundedRefuelsRequired = refuelsRequired % 1 >= 0.5 ? Math.ceil(refuelsRequired) : Math.floor(refuelsRequired);

    document.getElementById('routeResult').innerText = `Для поездки на ${distance} км потребуется ${roundedFuelRequired} литров топлива. Это означает, что вам потребуется заправиться ${roundedRefuelsRequired} раз(а).`;
});
