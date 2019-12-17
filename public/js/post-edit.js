/* eslint-disable no-undef */
/* eslint-disable no-alert */
const postEditForm = document.getElementById('postEditForm');

postEditForm.addEventListener('submit', event => {
  const imageUploads = document.getElementById('imageUpload').files.length;
  const existingImages = document.querySelectorAll('.imageDeleteCheckbox')
    .length;
  const imageDeletions = document.querySelectorAll(
    '.imageDeleteCheckbox:checked'
  ).length;
  const newTotal = existingImages - imageDeletions + imageUploads;

  if (newTotal > 4) {
    event.preventDefault();
    const removalAmount = newTotal - 4;
    alert(
      `You must remove at least ${removalAmount} more image${
        removalAmount === 1 ? '' : 's'
      } before saving`
    );
  }
});
