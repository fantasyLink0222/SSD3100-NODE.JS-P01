document.getElementById('add-line-item').addEventListener('click', function() {
    // Clone the first .line-item
    var original = document.querySelector('.line-item');
    var clone = original.cloneNode(true);

    // Optionally reset the value of the inputs in the clone
    clone.querySelector('select[name="purchasedProduct[]"]').selectedIndex = 0;
    clone.querySelector('input[name="quantity[]"]').value = '';

    // Append the clone to the #line-items container
    document.getElementById('line-items').appendChild(clone);
});