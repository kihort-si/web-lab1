"use strict";

let x, y, r;
const resultTable = document.getElementById('result');

async function validate() {
    let success = true;
    if (validateX()) {
        hideErrorMessage('x');
    } else success = false;
    if (validateY()) {
        hideErrorMessage('y');
    } else success = false;
    if (validateR()) {
        hideErrorMessage('r');
    } else success = false;

    if (success) {
        let jsonData = {
            "x": x.toString(),
            "y": y.toString(),
            "r": r.toString()
        };

        let startTime = Date.now();

        await fetch(`/fcgi-bin/server.jar?${new URLSearchParams(jsonData).toString()}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(response => {
                let endTime = Date.now();
                let timeTaken = endTime - startTime;
                if (response.error != null) {
                    alert('Ответ от сервера не получен');
                    console.log(response.error);
                } else {
                    const newRow = resultTable.insertRow(-1);

                    const rowX = newRow.insertCell(0);
                    const rowY = newRow.insertCell(1);
                    const rowR = newRow.insertCell(2);
                    const rowTime = newRow.insertCell(3);
                    const rowDuration = newRow.insertCell(4);
                    const rowResult = newRow.insertCell(5);

                    const date = new Date();

                    rowX.textContent = x;
                    rowY.textContent = y;
                    rowR.textContent = r;
                    rowTime.textContent = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                    rowDuration.textContent = timeTaken + " мс";
                    rowResult.textContent = response.hit;
                }
            })
    }
}

function validateX() {
    if (!isNaN(parseFloat(x)) && isFinite(x)) return true;
    else {
        showErrorMessage('Введите X', 'x');
        return false;
    }
}

function validateY() {
    if (y === undefined || y === null) {
        showErrorMessage('Введите Y', 'y');
        return false;
    } else if (isNaN(parseFloat(y)) || !isFinite(y)) {
        showErrorMessage('Y должен быть числом', 'y');
        return false;
    } else if (parseFloat(y) < -5 || parseFloat(y) > 5) {
        showErrorMessage('Y должен быть в диапазоне от -5 до 5', 'y');
        return false;
    } else return true;
}

function validateR() {
    if (!isNaN(parseFloat(r)) && isFinite(r)) return true;
    else {
        showErrorMessage('Введите R', 'r');
        return false;
    }
}

function showErrorMessage(text, coordinate) {
    let textPlace = document.getElementById(coordinate + 'Error');
    textPlace.textContent = text;
    textPlace.style.opacity = '1';
}

function hideErrorMessage(coordinate) {
    let textPlace = document.getElementById(coordinate + 'Error');
    textPlace.style.opacity = '0';
}

function setupButtons(className) {
    document.querySelectorAll('.' + className + ' input[type="button"]').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.' + className + ' input[type="button"]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            updateValues();
        });
    })
}

function setupY() {
    document.getElementById('yInput').addEventListener('input', function () {
        y = document.getElementById('yInput').value.replace(',', '.');
    })
}

setupButtons('xButtons');
setupY();
setupButtons('rButtons');

function updateValues() {
    x = document.querySelector('.xButtons input.active')?.value;
    r = document.querySelector('.rButtons input.active')?.value;
}