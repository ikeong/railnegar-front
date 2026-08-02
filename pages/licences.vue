<template>
  <div class="licences-page min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        مجوزها و نماد اعتماد
      </h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 space-y-8">
        <section>
          <h2 class="text-2xl font-bold mb-4 text-primary-600">نماد اعتماد الکترونیکی</h2>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            ریل‌نگار دارای نماد اعتماد الکترونیکی از مرکز توسعه تجارت الکترونیکی وزارت صنعت، معدن و تجارت می‌باشد. این نماد نشان‌دهنده اعتبار و امنیت خدمات الکترونیکی ارائه شده توسط ریل‌نگار است.
          </p>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-4 text-primary-600">مجوزهای قانونی</h2>
          <div class="space-y-4 text-gray-700 dark:text-gray-300">
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-bold mb-2">۱. مجوز فعالیت در حوزه گردشگری</h3>
              <p>ریل‌نگار دارای مجوز رسمی از سازمان میراث فرهنگی، گردشگری و صنایع دستی برای فعالیت در حوزه خدمات گردشگری و فروش بلیط قطار می‌باشد.</p>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-bold mb-2">۲. ثبت شرکت در سامانه ثبت احوال</h3>
              <p>شرکت ریل‌نگار با شماره ثبت [شماره ثبت] در سامانه ثبت احوال شرکت‌ها و موسسات غیرتجاری به ثبت رسیده است.</p>
            </div>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 class="font-bold mb-2">۳. مجوز پرداخت الکترونیکی</h3>
              <p>ریل‌نگار دارای مجوز پرداخت الکترونیکی از بانک مرکزی جمهوری اسلامی ایران برای ارائه خدمات پرداخت آنلاین می‌باشد.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 class="text-2xl font-bold mb-4 text-primary-600">اطلاعات تماس</h2>
          <div class="text-gray-700 dark:text-gray-300">
            <p class="mb-2">برای کسب اطلاعات بیشتر در مورد مجوزها و نماد اعتماد، می‌توانید با پشتیبانی ریل‌نگار تماس بگیرید.</p>
            <p class="text-lg font-bold">شماره پشتیبانی: {{ toPersianDigits('021-28421206') }}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePersianNumber } from '~/composables/utils/usePersianNumber'

const { toPersianDigits } = usePersianNumber()

useHead({
  title: 'مجوزها و نماد اعتماد | ریل‌نگار'
})
</script>
