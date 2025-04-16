document.addEventListener('DOMContentLoaded', function () {
  // Lấy tất cả các mục có dropdown icon
  const dropdownItems = document.querySelectorAll('.nav-item');

  dropdownItems.forEach((item) => {
    // Lắng nghe sự kiện click
    item.addEventListener('click', function () {
      const icon = this.querySelector('.dropdown-icon i'); // Lấy icon bên trong span

      if (icon) {
        // Kiểm tra nếu icon tồn tại
        // Kiểm tra nếu icon đang là fa-chevron-down thì chuyển thành fa-chevron-up và ngược lại
        if (icon.classList.contains('fa-chevron-down')) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        } else {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        }
      }
    });
  });
});
