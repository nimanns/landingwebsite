const div = document.querySelector("div.one");
const sections = document.querySelectorAll("div[data-section]>a");
const states = new Map();
const accordionParts = new Map();
let timeouts = [[], [], [], []];
let interval = 200;
let currentImageOnModal = null;
let currentImageIndex = null;
const modal = document.querySelector("div[data-modal]");
const imageOnModal = document.createElement("img");
const imageWrapper = document.createElement("div");
const closeBtn = document.createElement("button");
const nextBtn = document.createElement("button");
const prevBtn = document.createElement("button");
nextBtn.textContent = "❯";
prevBtn.textContent = "❮";
closeBtn.id = "close-btn";
nextBtn.id = "next-btn";
prevBtn.id = "prev-btn";
nextBtn.classList.add("navigator");
prevBtn.classList.add("navigator");
const imageCount = 10;
const iterateNext = () => {
  if (!currentImageOnModal) return;
  let currentIndex = currentImageIndex;
  if (isNaN(currentIndex)) return;
  if (currentIndex < imageCount) {
    imageOnModal.src = `/static/gallery/${currentIndex + 1}.jpg`;
    currentImageOnModal.removeAttribute("style");
    currentImageOnModal =
      document.querySelectorAll("img[data-gallery]")[currentIndex];
    currentImageOnModal.style.opacity = 0;
    currentImageIndex++;
  }
};

const iteratePrevious = () => {
  if (!currentImageOnModal) return;
  let currentIndex = currentImageIndex;
  if (isNaN(currentIndex)) return;
  if (currentIndex > 1) {
    imageOnModal.src = `/static/gallery/${currentIndex - 1}.jpg`;
    currentImageOnModal.removeAttribute("style");
    currentImageOnModal =
      document.querySelectorAll("img[data-gallery]")[currentIndex - 2];
    currentImageOnModal.style.opacity = 0;
    currentImageIndex--;
  }
};
handleGalleryKeyDown = function (ev) {
  switch (ev.key) {
    case "ArrowRight":
      iterateNext();
      break;
    case "ArrowLeft":
      iteratePrevious();
      break;
  }
};
nextBtn.onclick = (e) => {
  e.stopPropagation();
  iterateNext();
};

prevBtn.onclick = (e) => {
  e.stopPropagation();
  iteratePrevious();
};

for (let i = 0; i < imageCount; i++) {
  const gallery = document.querySelector("div[data-section]#five");
  const card = document.createElement("div");
  card.classList.add("card");
  const image = document.createElement("img");
  image.setAttribute("data-image", true);
  image.setAttribute("data-gallery", true);
  image.src = `/static/gallery/${i + 1}.jpg`;
  image.setAttribute("width", "100%");
  card.appendChild(image);
  gallery.querySelector("div.content")?.appendChild(card);
}

imageOnModal.onclick = (ev) => {
  ev.stopPropagation();
};
closeBtn.innerHTML = "❌";
closeBtn.onclick = closeModal;
imageWrapper.id = "image-wrapper";
imageOnModal.onclick = (ev) => {
  ev.stopPropagation();
};
imageOnModal.classList.add("modal-image");

document.onreadystatechange = function (e) {
  if (document.readyState === "complete") {
    if (localStorage.getItem("theme")) {
      changeTheme(localStorage.getItem("theme"));
    }
    let selectedSection = window.location.toString().split("#")[1];
    switch (selectedSection) {
      case "six":
      case "five":
      case "four":
      case "three":
        document.querySelector(`a[href='#${selectedSection}']`).click();
        break;
      default:
        break;
    }
  }
};

function changeTheme(index) {
  let theme = "first";
  switch (parseInt(index)) {
    case 0:
      theme = "first";
      break;
    case 1:
      theme = "second";
      break;
    case 2:
      theme = "third";
      break;
    case 3:
      theme = "fourth";
      break;
    case 4:
      theme = "fifth";
      break;
    case 5:
      theme = "sixth";
      break;
    default:
      theme = "first";
      localStorage.setItem("theme", "0");
      break;
  }

  Object.keys(document.body.dataset).forEach((dataKey) => {
    if (dataKey == theme) return;
    delete document.body.dataset[dataKey];
  });
  document.body.setAttribute(`data-${theme}`, true);
}

sections.forEach((el, index) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const section = e.target.parentElement;
    const nextSection = section.nextElementSibling;
    const content = section.querySelector("div.content");
    for (let i = 0; i < timeouts[index].length; i++) {
      clearTimeout(timeouts[index][i]);
    }
    timeouts[index] = [];
    if (states.get(section)) {
      e.preventDefault();
      let timeElapsed = interval;
      const accordion = el.parentElement.lastChild;
      const arr = Array.from(accordion.childNodes);
      content.classList.remove("show-content");
      arr.reverse().forEach((el, ind) => {
        if (ind < 1) {
          interval = 300;
        } else if (ind >= 1 && ind < 3) {
          interval = 200;
        } else {
          interval = 100;
        }
        setTimeout(() => {
          if (ind < 1) {
            el.classList.add("animate2-uno");
          } else if (ind >= 1 && ind < 3) {
            el.classList.add("animate2-dos");
          } else {
            el.classList.add("animate2-tres");
          }
        }, timeElapsed);
        timeElapsed += interval;
      });

      states.set(section, false);

      timeouts[index].push(
        setTimeout(() => {
          nextSection.removeAttribute("style");
          content.removeAttribute("style");
          el.parentElement.querySelectorAll("div.accordion").forEach((el) => {
            section.removeChild(el);
          });
        }, timeElapsed)
      );

      return;
    }

    content.style.display = "grid";
    states.set(section, true);
    const height = section.querySelector("div.content").offsetHeight;
    const number = Math.ceil(height / section.offsetHeight) + 1;
    const accordion = document.createElement("div");
    accordion.classList.add("accordion");

    nextSection.style.marginTop = section.offsetHeight * number + "px";

    for (let i = 0; i < number; i++) {
      accordion.appendChild(document.createElement("div"));
    }

    let times = interval;

    accordion.childNodes.forEach((el, ind) => {
      accordionParts.set(ind, el);
      if (ind < 1) {
        interval = 300;
      } else if (ind >= 1 && ind < 3) {
        interval = 200;
      } else {
        interval = 100;
      }
      setTimeout(() => {
        if (ind < 1) {
          el.classList.add("animate-uno");
        } else if (ind >= 1 && ind < 3) {
          el.classList.add("animate-dos");
        } else {
          el.classList.add("animate-tres");
        }
      }, times);
      times += interval;
    }, true);

    section.appendChild(accordion);

    timeouts[index].push(
      setTimeout(() => {
        content.classList.add("show-content");
      }, times)
    );
    window.requestAnimationFrame(() => {
      document
        .querySelector(["#three", "#four", "#five", "#six"][index])
        .scrollIntoView(true);
    });
    e.stopPropagation();
  });
});

window.onresize = () => {
  states.forEach((value, section) => {
    if (value) {
      const accordion = section.querySelector("div.accordion");
      const childrenCount = accordion.childElementCount;
      const height = section.querySelector("div.content").offsetHeight;
      const number = Math.ceil(height / section.offsetHeight) + 1;
      const nextSection = section.nextElementSibling;

      if (childrenCount !== number) {
        const delta = number - childrenCount;
        if (delta < 0) {
          for (let i = 0; i < Math.abs(delta); i++) {
            accordion.removeChild(accordion.lastChild);
            nextSection.style.marginTop = section.offsetHeight * number + "px";
          }
        } else if (delta > 0) {
          for (let i = 0; i < delta; i++) {
            accordion.appendChild(document.createElement("div"));
            accordion.lastChild.classList.add("animate-dos");
          }
          nextSection.style.marginTop = section.offsetHeight * number + "px";
        }
      }
    }
  });
};

Array.from(
  document.querySelector("div[data-change-theme]").querySelectorAll("div")
).forEach((el, ind) => {
  ["enter"];
  el.addEventListener("click", (e) => {
    e.preventDefault();
    changeTheme(ind);
    localStorage.setItem("theme", ind.toString());
  });
  el.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      changeTheme(ind);
      localStorage.setItem("theme", ind.toString());
    }
  });
});

function closeModal() {
  document.removeEventListener("keydown", handleGalleryKeyDown);
  modal.classList.remove("visible");
  modal.innerHTML = "";
  if (currentImageOnModal) {
    currentImageOnModal.removeAttribute("style");
    currentImageOnModal = null;
  }
  imageWrapper.innerHTML = "";
}

document.querySelector("div[data-modal]")?.addEventListener("click", (ev) => {
  closeModal();
});

document.querySelectorAll("[data-image]").forEach((image, ind) => {
  image.addEventListener("click", (ev) => {
    const img = new Image();
    img.onload = function () {
      imageOnModal.style.maxWidth = this.width + "px";
      imageOnModal.style.maxHeight = this.height + "px";
    };
    img.src = image.src;
    imageWrapper.appendChild(closeBtn);
    if (image.attributes.getNamedItem("data-gallery")) {
      imageWrapper.append(nextBtn);
      imageWrapper.append(prevBtn);
      document.addEventListener("keydown", handleGalleryKeyDown);
    }
    modal.classList.add("visible");
    imageOnModal.src = image.src;
    imageWrapper.appendChild(imageOnModal);
    modal.appendChild(imageWrapper);
    image.style.opacity = 0;
    currentImageOnModal = image;
    currentImageIndex = ind;
  });
});

let names_index = 0;
let scroll_state = false;
const times = [0.6, 0.2, 0.4, 1.4];
function scroll_name_chars() {
  const elements_array = document.querySelectorAll("span.name");
  const elements_array_fa = document.querySelectorAll("span.name-fa");
  if (!scroll_state) {
    if (names_index % 2 == 0) {
      elements_array[
        names_index
      ].style.animation = `char_move_to_top ${times[names_index]}s ease forwards`;
      elements_array_fa[
        names_index
      ].style.animation = `char_move_from_bottom ${times[names_index]}s ease forwards`;
    } else {
      elements_array[
        names_index
      ].style.animation = `char_move_to_bottom ${times[names_index]}s ease forwards`;
      elements_array_fa[
        names_index
      ].style.animation = `char_move_from_top ${times[names_index]}s ease forwards`;
    }
  } else {
    if (names_index % 2 != 0) {
      elements_array_fa[
        names_index
      ].style.animation = `char_move_to_top ${times[names_index]}s ease forwards`;
      elements_array[
        names_index
      ].style.animation = `char_move_from_bottom ${times[names_index]}s ease forwards`;
    } else {
      elements_array_fa[
        names_index
      ].style.animation = `char_move_to_bottom ${times[names_index]}s ease forwards`;
      elements_array[
        names_index
      ].style.animation = `char_move_from_top ${times[names_index]}s ease forwards`;
    }
  }
  names_index++;
  if (names_index === 4) {
    names_index = 0;
    scroll_state = !scroll_state;
  }
  setTimeout(scroll_name_chars, names_index > 0 ? 200 : 6000);
}

setTimeout(scroll_name_chars, 1000);

//contact form
const contactForm = document.getElementById("contact-form");
const collapseBtn = document.getElementById("collapse-form");

collapseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  contactForm.classList.toggle("collapsed");
  if (!contactForm.classList.contains("collapsed")) e.target.scrollIntoView();
});

document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      sender_name: document.getElementById("sender-name").value,
      sender_email: document.getElementById("sender-email").value,
      subject: document.getElementById("subject").value,
      body: document.getElementById("body").value,
    };

    fetch("https://scrapenimanns-c8544d688b32.herokuapp.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.text())
      .then((data) => {
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = "Message sent! Thank you for reaching out 😊";
        resultDiv.className = "success";
      })
      .catch((error) => {
        const resultDiv = document.getElementById("result");
        resultDiv.textContent =
          "Error: " +
          "Failed to send the message at the moment. Please try again later.";
        resultDiv.className = "error";
      });
  });
