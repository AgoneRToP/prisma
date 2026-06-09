function white() {
  console.log('white');
}

const black = function () {
  console.log('black');
};

const red = () => {
  console.log('red');
};

hoistedFunc();
function hoistedFunc() { console.log("Ishladi"); }