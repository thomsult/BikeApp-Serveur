<x-mail::layout>
  {{-- Header --}}
  <x-slot:header>
    <x-mail::header :url="config('app.url')">
      {{-- {{ config('app.name') }} --}}

    </x-mail::header>
  </x-slot:header>
  <div style="text-align:center; margin-bottom:25px;">
    <img src="{{ asset('images/play_store_512.png') }}" width="140" alt="BikeApp" style="border-radius: 1em;">
  </div>
  {{-- Body --}}
  {!! $slot !!}

  {{-- Subcopy --}}
  @isset($subcopy)
    <x-slot:subcopy>
      <x-mail::subcopy>
        {!! $subcopy !!}
      </x-mail::subcopy>
    </x-slot:subcopy>
  @endisset

  {{-- Footer --}}
  <x-slot:footer>
    <x-mail::footer>
      © {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}
    </x-mail::footer>
  </x-slot:footer>
</x-mail::layout>