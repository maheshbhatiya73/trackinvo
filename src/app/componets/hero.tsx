"use client"
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
return (
<>
  <section className="py-4 mt-14 sm:mt16 lg:mt-0">
    <div className="mx-auto lg:max-w-7xl w-full px-5 sm:px-10 md:px-12 lg:px-5 grid lg:grid-cols-2 lg:items-center gap-10">
      <div className="flex flex-col space-y-8 sm:space-y-10 lg:items-center text-center lg:text-left max-w-2xl md:max-w-3xl mx-auto">
        <h1 className=" font-semibold leading-tight text-teal-950 dark:text-white text-4xl sm:text-5xl lg:text-6xl">
          {` We'll be happy to take care of `} <span className="text-transparent bg-clip-text bg-gradient-to-tr from-pink-700 to-orange-800">your work.</span>
        </h1>
        <p className=" flex text-gray-700 dark:text-gray-300 tracking-tight md:font-normal max-w-xl mx-auto lg:max-w-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem molestiae soluta ipsa
          incidunt expedita rem! Suscipit molestiae voluptatem iure, eum alias nobis velit quidem
          reiciendis saepe nostrum
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
          <Link href="#" className="px-6 items-center h-12 rounded-3xl bg-pink-600 text-white duration-300 ease-linear flex justify-center w-full sm:w-auto">
            Get started
          </Link>
          <Link href="#" className="px-6 items-center h-12 rounded-3xl text-pink-700 border border-gray-100 dark:border-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 duration-300 ease-linear flex justify-center w-full sm:w-auto">
            Book a call
          </Link>
        </div>
      </div>
      <div className="flex aspect-square lg:aspect-auto lg:h-[35rem] relative">
        <div className="w-3/5 h-[80%] rounded-3xl overflow-clip border-8 border-gray-200 dark:border-gray-950 z-30">
          <Image src="https://images.prismic.io/statrys/cb8efbd4-dd23-4642-a339-69df5d58b760_what-is-an-invoice-cover.png?auto=compress%2Cformat&rect=0%2C0%2C680%2C680&w=680&h=680&fit=max" alt="buildind plan image" width={1300} height={1300} className="w-full h-full object-cover z-30" />
        </div>
        <div className="absolute right-0 bottom-0 h-[calc(100%-50px)] w-4/5 rounded-3xl overflow-clip border-4 border-gray-200 dark:border-gray-800 z-10">
          <Image src="https://static.vecteezy.com/system/resources/previews/020/716/214/non_2x/icon-online-invoice-illustration-invoice-icon-free-png.png" alt="working-on-housing-project" height={1300} width={1300} className="z-10 w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
</>
)
}