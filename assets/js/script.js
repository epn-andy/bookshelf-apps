const KEY_BC = "bc";
const KEY_BNC = "bnc";

document.querySelector("#btnSearch").addEventListener("click", function () {
  const formInput = document.getElementById("formInput");
  const formCari = document.getElementById("formCari");
  const btnSearch = document.getElementById("btnSearch");
  const judulText = document.getElementById("judulText");
  const btnBack = document.getElementById("btnBack");

  formInput.classList.remove("flex");
  formInput.classList.add("hidden");
  formCari.classList.remove("hidden");
  formCari.classList.add("flex");
  btnSearch.classList.add("hidden");
  btnBack.classList.remove("hidden");
  judulText.innerText = "Masukkan Judul Buku";
});

document.querySelector("#btnBack").addEventListener("click", function () {
  const formInput = document.getElementById("formInput");
  const formCari = document.getElementById("formCari");
  const btnSearch = document.getElementById("btnSearch");
  const judulText = document.getElementById("judulText");
  const btnBack = document.getElementById("btnBack");

  formInput.classList.add("flex");
  formInput.classList.remove("hidden");
  formCari.classList.add("hidden");
  formCari.classList.remove("flex");
  btnSearch.classList.remove("hidden");
  btnBack.classList.add("hidden");
  judulText.innerText = "Masukkan Buku Anda";

  const a = document.getElementById("displayBelumWrap");
  const b = document.getElementById("displaySelesaiWrap");
  const c = document.getElementById("displayHasilWrap");
  a.classList.remove("hidden");
  b.classList.remove("hidden");
  c.classList.add("hidden");
});

function cekWebStorage() {
  return typeof localStorage !== "undefined";
}

window.addEventListener("load", function () {
  if (!cekWebStorage()) {
    alert("Browser anda tidak mendukung web storage!");
  }
});

function saveCompletedBook(data) {
  let bukuSelesai = null;
  if (localStorage.getItem(KEY_BC) === null) {
    bukuSelesai = [];
  } else {
    bukuSelesai = JSON.parse(localStorage.getItem(KEY_BC));
  }
  bukuSelesai.unshift(data);
  localStorage.setItem(KEY_BC, JSON.stringify(bukuSelesai));
}

function saveUncompletedBook(data) {
  let bukuBelumSelesai = null;
  if (localStorage.getItem(KEY_BNC) === null) {
    bukuBelumSelesai = [];
  } else {
    bukuBelumSelesai = JSON.parse(localStorage.getItem(KEY_BNC));
  }
  bukuBelumSelesai.unshift(data);
  localStorage.setItem(KEY_BNC, JSON.stringify(bukuBelumSelesai));
}

function displayList(data) {
  const btnMove = document.createElement("button");
  if (data.isComplete) {
    btnMove.innerText = "Belum Selesai dibaca";
    btnMove.classList.add("button-done");
    btnMove.setAttribute("id", "undone-" + data.id);
  }
  if (!data.isComplete) {
    btnMove.innerText = "Selesai dibaca";
    btnMove.classList.add("button-done");
    btnMove.setAttribute("id", "done-" + data.id);
  }

  const btnDel = document.createElement("button");
  btnDel.innerText = "Hapus Buku";
  btnDel.classList.add("button-delete");
  btnDel.setAttribute("id", "delete-" + data.id);

  const btnWrap = document.createElement("div");
  btnWrap.classList.add("button-wrap");
  btnWrap.append(btnMove, btnDel);

  const h3 = document.createElement("h3");
  h3.innerText = data.title;
  h3.classList.add("book-title");

  const p1 = document.createElement("p");
  p1.innerText = data.author;
  p1.classList.add("book-detail");

  const p2 = document.createElement("p");
  p2.innerText = data.year;
  p2.classList.add("book-detail");

  const divWrap = document.createElement("div");
  divWrap.classList.add("wrap-div");
  divWrap.append(h3, p1, p2, btnWrap);
  divWrap.setAttribute("id", "buku-" + data.id);

  const hr = document.createElement("hr");
  hr.classList.add("hr-line");

  const wrapAll = document.createElement("div");
  wrapAll.append(divWrap, hr);

  return wrapAll;
}

function renderDisplayList() {
  const uncompletedBooks = document.getElementById("displayBelum");
  uncompletedBooks.innerHTML = "";
  const completedBooks = document.getElementById("displaySelesai");
  completedBooks.innerHTML = "";
  if (localStorage.getItem(KEY_BNC) !== null) {
    const bncBooks = JSON.parse(localStorage.getItem(KEY_BNC));
    for (const book of bncBooks) {
      if (!book.isComplete) {
        const bookElement = displayList(book);
        uncompletedBooks.append(bookElement);
      }
    }
  }
  if (localStorage.getItem(KEY_BC) !== null) {
    const bcBooks = JSON.parse(localStorage.getItem(KEY_BC));
    for (const book of bcBooks) {
      if (book.isComplete) {
        const bookElement = displayList(book);
        completedBooks.append(bookElement);
      }
    }
  }
}

function findBookBNC(bookId) {
  if (localStorage.getItem(KEY_BNC) !== []) {
    const bncBooks = JSON.parse(localStorage.getItem(KEY_BNC));
    for (i = 0; i <= bncBooks.length; i++) {
      if (bncBooks[i].id === bookId) {
        return i;
      }
    }
  }
}

function findBookBC(bookId) {
  if (localStorage.getItem(KEY_BC) !== []) {
    const bcBooks = JSON.parse(localStorage.getItem(KEY_BC));
    for (i = 0; i <= bcBooks.length; i++) {
      if (bcBooks[i].id === bookId) {
        return i;
      }
    }
  }
}

function moveBook() {
  if (localStorage.getItem(KEY_BNC) !== null) {
    const bncBooks = JSON.parse(localStorage.getItem(KEY_BNC));
    for (const book of bncBooks) {
      const a = document.querySelector("#done-" + book.id);
      a.addEventListener("click", function () {
        const bookTarget = findBookBNC(book.id);
        book.isComplete = true;
        saveCompletedBook(book);
        bncBooks.splice(bookTarget, 1);
        localStorage.setItem(KEY_BNC, JSON.stringify(bncBooks));
        renderDisplayList();
        moveBook();
        delBook();
        displayToastPindah();
      });
    }
  }
  if (localStorage.getItem(KEY_BC) !== null) {
    const bcBooks = JSON.parse(localStorage.getItem(KEY_BC));
    for (const book of bcBooks) {
      const a = document.querySelector("#undone-" + book.id);
      a.addEventListener("click", function () {
        const bookTarget = findBookBC(book.id);
        book.isComplete = false;
        saveUncompletedBook(book);
        bcBooks.splice(bookTarget, 1);
        localStorage.setItem(KEY_BC, JSON.stringify(bcBooks));
        renderDisplayList();
        moveBook();
        delBook();
        displayToastPindah();
      });
    }
  }
}

function delBook() {
  if (localStorage.getItem(KEY_BNC) !== null) {
    const bncBooks = JSON.parse(localStorage.getItem(KEY_BNC));
    for (const book of bncBooks) {
      const a = document.querySelector("#delete-" + book.id);
      a.addEventListener("click", function () {
        const bookTarget = findBookBNC(book.id);
        bncBooks.splice(bookTarget, 1);
        localStorage.setItem(KEY_BNC, JSON.stringify(bncBooks));
        renderDisplayList();
        moveBook();
        delBook();
        displayToastHapus();
      });
    }
  }
  if (localStorage.getItem(KEY_BC) !== null) {
    const bcBooks = JSON.parse(localStorage.getItem(KEY_BC));
    for (const book of bcBooks) {
      const a = document.querySelector("#delete-" + book.id);
      a.addEventListener("click", function () {
        const bookTarget = findBookBC(book.id);
        bcBooks.splice(bookTarget, 1);
        localStorage.setItem(KEY_BC, JSON.stringify(bcBooks));
        renderDisplayList();
        moveBook();
        delBook();
        displayToastHapus();
      });
    }
  }
}

function displayToastSimpan() {
  const toast = document.getElementById("toast-success-simpan");
  toast.classList.remove("opacity-0");
  setTimeout(function () {
    toast.classList.add("opacity-100");
  }, 2500);
  setTimeout(function () {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2500);
}

function displayToastPindah() {
  const toast = document.getElementById("toast-success-pindah");
  toast.classList.remove("opacity-0");
  setTimeout(function () {
    toast.classList.add("opacity-100");
  }, 2500);
  setTimeout(function () {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2500);
}

function displayToastHapus() {
  const toast = document.getElementById("toast-danger");
  toast.classList.remove("opacity-0");
  setTimeout(function () {
    toast.classList.add("opacity-100");
  }, 2500);
  setTimeout(function () {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2500);
}

const btnSimpan = document.querySelector("#btnSimpan");
btnSimpan.addEventListener("click", function () {
  let judulBuku = document.getElementById("judulBuku").value;
  let penulisBuku = document.getElementById("penulisBuku").value;
  let tahunTerbit = document.getElementById("tahunTerbit").value;
  let selesaiBaca = document.getElementById("selesaiBaca").checked;
  const buku = {
    id: +new Date(),
    title: judulBuku,
    author: penulisBuku,
    year: tahunTerbit,
    isComplete: selesaiBaca,
  };
  buku.isComplete ? saveCompletedBook(buku) : saveUncompletedBook(buku);
  renderDisplayList();
  moveBook();
  delBook();
  displayToastSimpan();
  document.getElementById("judulBuku").value = "";
  document.getElementById("penulisBuku").value = "";
  document.getElementById("tahunTerbit").value = "";
  document.getElementById("selesaiBaca").checked = false;
});

document.querySelector("#getBook").addEventListener("click", function () {
  const a = document.getElementById("displayBelumWrap");
  const b = document.getElementById("displaySelesaiWrap");
  const c = document.getElementById("displayHasilWrap");
  a.classList.add("hidden");
  b.classList.add("hidden");
  c.classList.remove("hidden");
  const displayHasil = document.getElementById("displayHasil");
  displayHasil.innerHTML = "";
  const keywordJudul = document.getElementById("keywordJudul").value;
  if (localStorage.getItem(KEY_BNC) !== null) {
    const bncBooks = JSON.parse(localStorage.getItem(KEY_BNC));
    for (const book of bncBooks) {
      if (book.title == keywordJudul) {
        const bookElement = displayList(book);
        displayHasil.append(bookElement);
        return;
      }
    }
  }
  if (localStorage.getItem(KEY_BC) !== null) {
    const bcBooks = JSON.parse(localStorage.getItem(KEY_BC));
    for (const book of bcBooks) {
      if (book.title == keywordJudul) {
        const bookElement = displayList(book);
        displayHasil.append(bookElement);
      } else {
        const hasil = document.createElement("p");
        hasil.innerText = "Buku tidak ditemukan.";
        hasil.classList.add("nf-text");
        displayHasil.append(hasil);
      }
      return;
    }
  }
});

renderDisplayList();
moveBook();
delBook();
