/* eslint-disable */
$(document).ready(() => {
  bsCustomFileInput.init();
});

let postEditForm = document.getElementById('postEditForm');
postEditForm.addEventListener('submit', event => {
  let imageUploads = document.getElementById('imageUpload').files.length;
  let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
  let imageDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked')
    .length;
  let newTotal = existingImages - imageDeletions + imageUploads;
  if (newTotal > 4) {
    event.preventDefault();
    let removalAmount = newTotal - 4;
    alert(
      `You must remove at least ${removalAmount} more image${
        removalAmount === 1 ? '' : 's'
      } before saving`
    );
  }
});
