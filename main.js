init_messages();
document.getElementById("button").addEventListener("click", (event) => {
  let code = new Set(document.getElementById("code").value.split(" "));
  if (code == "") {
    return;
  }
  if (code.has("")) {
    code.delete("");
  }
  let alphabet = getAlphabet(code);
  let m = alphabet.size;
  let n = code.size;
  let code_string = "C=" + setToString(code);
  katex.default.render(code_string, document.getElementById("lcode"));
  isUniquelyDecodable(code);
});

function setToString(set) {
  if (set.size == 0) {
    return "\\varnothing";
  }
  i = 0;
  let string = "\\{";
  for (let el of set) {
    if (i < set.size - 1) {
      string += el + ",";
    } else {
      string += el + "\\}";
    }
    i++;
  }
  return string;
}

function isUniquelyDecodable(code) {
  init_messages();
  return SP([code], code);
}

function pref(l1, l2) {
  l = new Set([]);
  if (are_equals(l1, l)) {
    return new Set([...l2]);
  }
  if (are_equals(l2, l)) {
    return l;
  }
  for (let w1 of l1) {
    for (let w2 of l2) {
      if (w2.length >= w1.length) {
        if (w2.substr(0, w1.length) == w1) {
          let w = "";
          if (w1.length < w2.length) {
            w = w2.substr(w1.length, w2.length - w1.length);
          }
          if (!l.has(w)) {
            l.add(w);
          }
        }
      }
    }
  }
  return l;
}

function SP(sets, code) {
  if (checkDuplicates(sets)) {
    display_block("success");
    return true;
  }
  round = sets.length;
  prev = sets[round - 1];
  if (round == 1) {
    next = pref(prev, prev);
    next.delete("");
  } else {
    next = union(pref(code, prev), pref(prev, code));
  }
  print_round(round, next);

  // console.log(sets, next);
  if (contain_an_element_of(code, next)) {
    display_block("error");
    return false;
  } else if (next.size == 0) {
    display_block("success");
    return true;
  } else {
    sets.push(next);
    return SP(sets, code);
  }
}

function union(a, b) {
  return new Set([...a, ...b]);
}

function are_equals(a, b) {
  if (a.size != a.size) {
    return false;
  }
  for (let el of a) {
    if (!b.has(el)) {
      return false;
    }
  }
  return true;
}

function print_round(round, set) {
  let r = document.createElement("div");
  r.id = "round-" + round;

  document.getElementById("rounds").appendChild(r);
  let txt = "\\textbf\\ C_{" + round + "}=" + setToString(set);
  katex.default.render(txt, document.getElementById("round-" + round));
}

function checkDuplicates(sets) {
  // console.log(sets.length);
  // if (sets.length <= 1) return false;

  let setsArray = [];
  for (let item of sets) setsArray.push(item);
  // console.log(setsArray);

  for (let i = 0; i < setsArray.length - 1; i++) {
    for (let j = i + 1; j < setsArray.length; j++) {
      let v1 = [];
      let v2 = [];
      let ok = true;

      for (let item of setsArray[i]) v1.push(item);
      for (let item of setsArray[j]) v2.push(item);

      // console.log(v1.length, v2.length);
      if (v1.length == v2.length) {
        for (let k = 0; k < v1.length; k++) {
          if (v1[k] != v2[k]) {
            ok = false;
          }
        }

        if (ok == true) {
          return true;
        }
      }
    }
  }

  return false;
}

function contain_an_element_of(a, b) {
  for (let el of a) {
    if (b.has(el)) {
      return true;
    }
  }
  return false;
}

function getAlphabet(code) {
  alphabet = new Set([]);
  for (let word of code) {
    for (var j = 0; j < word.length; j++) {
      let letter = word.charAt(j);
      alphabet.add(letter);
    }
  }
  return alphabet;
}

function hide_block(id) {
  document.getElementById(id).style.display = "none";
}

function display_block(id) {
  document.getElementById(id).style.display = "inline-flex";
}

function init_messages() {
  hide_block("success");
  hide_block("error");
  document.getElementById("rounds").innerHTML = "";
}

//daca unul dintre c -uri contine ul elemnt din c nu e cod

// daca un ci este multimea vida nu e cod
// daca sunt doua multime egale e cod
