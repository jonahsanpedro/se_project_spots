export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText; //set the loading text
    //set the loading text
  } else {
    button.textContent = defaultText; //set the default text
    //set the not loading text
  }
}
