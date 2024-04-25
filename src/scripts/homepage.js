async function getUserData() {

    try {
        const response = await fetch("/get-users");

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
getUserData();