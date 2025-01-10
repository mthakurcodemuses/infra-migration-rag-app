import * as React from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight } from "lucide-react"

import 'swiper/css'
import 'swiper/css/navigation'

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode[]
  opts?: any
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, opts = {}, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: '.carousel-prev',
            nextEl: '.carousel-next',
          }}
          {...opts}
        >
          {children.map((child, index) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>
        <Button
          variant="outline"
          size="icon"
          className="carousel-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 h-8 w-8 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="carousel-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 h-8 w-8 rounded-full"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

export {
  type CarouselProps,
  Carousel,
  CarouselContent,
  CarouselItem,
}