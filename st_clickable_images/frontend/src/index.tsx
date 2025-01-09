import { Streamlit, RenderData } from "streamlit-component-lib"

function onRender(event: Event): void {
  const data = (event as CustomEvent<RenderData>).detail

  // Remove existing content
  let child = document.body.lastElementChild;
  if (child) {
    document.body.removeChild(child)
  }

  // Add and style the image container
  let div = document.body.appendChild(document.createElement("div"))
  for (let key in data.args["div_style"]) {
    div.style[key as any] = data.args["div_style"][key]
  }

  // Add and style all images
  let imagesLoaded = 0
  for (let i = 0; i < data.args["paths"].length; i++) {
    let img = div.appendChild(document.createElement("img"))
    for (let key in data.args["img_style"]) {
      img.style[key as any] = data.args["img_style"][key]
    }
    img.src = data.args["paths"][i]
    if (data.args["titles"].length > i) {
      img.title = data.args["titles"][i]
    }
    img.onclick = function (): void {
      // Remove the class from all images
      const allImages = div.getElementsByTagName("img")
      for (let j = 0; j < allImages.length; j++) {
        allImages[j].classList.remove("selected")
      }

      // Add the class to the clicked image
      this.classList.add("selected")

      // Send the index of the clicked image to Streamlit
      Streamlit.setComponentValue(i)
    }
    // eslint-disable-next-line
    img.onload = function (): void {
      imagesLoaded++
      if (imagesLoaded === data.args["paths"].length) {
        Streamlit.setFrameHeight()
      }
    }
  }
}

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
Streamlit.setComponentReady()
