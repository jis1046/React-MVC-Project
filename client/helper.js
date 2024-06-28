/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  /* Make the message box appear again after closing it by changing display status to block*/
    document.getElementById('errorMessageBox').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessageBox').classList.remove('hidden');
     /* Close the message box by clicking x icon*/
     document.getElementById('closeButton').addEventListener('click', function() {
      document.getElementById('errorMessageBox').style.display = 'none';
    });
  };
  
  /* Sends post requests to the server using fetch. Will look for various
     entries in the response JSON object, and will handle them appropriately.
  */
  const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    document.getElementById('errorMessageBox').classList.add('hidden');
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
  };

const hideError = () => {
    document.getElementById('errorMessageBox').classList.add('hidden');
   
};





module.exports = {
    handleError,
    sendPost,
    hideError,
};