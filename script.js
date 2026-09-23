// --- 1. Automatic Age Calculation ---
document.getElementById('dob').addEventListener('change', function() {
    const dobInput = this.value;
    if (!dobInput) return;

    const dob = new Date(dobInput);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    document.getElementById('calculatedAge').value = `${age} years old`;
});

// --- 2. Live Photo Upload Preview & Base64 Converter ---
document.getElementById('studentPhoto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert("Please upload a photo under 2MB.");
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            const placeholder = document.getElementById('previewPlaceholder');
            
            preview.src = e.target.result;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
            
            document.getElementById('photoBase64').value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// --- 3. Interactive FAQ Accordion ---
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqAnswer = button.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (faqAnswer.style.display === 'block') {
            faqAnswer.style.display = 'none';
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
        } else {
            faqAnswer.style.display = 'block';
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
    });
});

// --- 4. Google Sheets Backend Submission ---
// Replace the URL below with your actual Google Web App URL (ending in /exec)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOuSmlCySaQeUs3UnskG-q1JUibJVU709qDjAhqIVCn7zLrDodjNG1FqSRa1oKl2-e/exec';

document.getElementById('admissionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = this;
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');
    
    submitBtn.disabled = true;
    loader.classList.remove('hidden');

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: params
    })
    .then(() => {
        form.classList.add('hidden');
        loader.classList.add('hidden');
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('appIdDisplay').innerText = 'SGKH-2026-' + Math.floor(Math.random() * 90000 + 10000);
    })
    .catch(error => {
        console.error('Submission Error:', error);
        alert("Submission failed. Check your Web App URL in script.js.");
        submitBtn.disabled = false;
        loader.classList.add('hidden');
    });
});// Clear Form Event Handler
document.getElementById('admissionForm').addEventListener('reset', function() {
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('previewPlaceholder').style.display = 'block';
    document.getElementById('calculatedAge').value = '';
});function resetFormView() {
    // 1. Reset input values
    const form = document.getElementById('admissionForm');
    if (form) form.reset();
    
    // 2. Clear photo preview
    const preview = document.getElementById('photoPreview');
    const placeholder = document.getElementById('previewPlaceholder');
    if (preview && placeholder) {
        preview.style.display = 'none';
        placeholder.style.display = 'block';
    }

    // 3. Hide success popup and show form again
    document.getElementById('successMessage').classList.add('hidden');
    form.classList.remove('hidden');
    
    // 4. Re-enable submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = false;

    // 5. Scroll smoothly back to top of form
    document.getElementById('admissions').scrollIntoView({ behavior: 'smooth' });
}