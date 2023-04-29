---
layout: "layouts/work-post.njk"
title: "In Utopia"
type: "BlogPosting"
priority: "0.5"
date: 2018-06-01
year: "2018"
tags: ["featured_work"]
description: "In Utopia was an installation of a made for my undergraduate degree show group exhibition in 2018. The installation consisted of a series of large sculptures, ceramics, improvised structures and a single channel video mockumentary."

video:
  - url: "/assets/video/works/in-utopia/in-utopia.m4v"
    name: "Yeah, about utopia ..."
    description: "Single channel video mockumentary. Installed within the sculpture 'Smoke Stack': 25mm steel square tube & 3D printed SLS plastic"
    thumbnail: "/assets/img/works/in-utopia/in-utopia.webp"
    uploadDate: "2018-06-01"
    duration: "PT6M15S"
  - url: "/assets/video/works/in-utopia/edge-of-mars.mp4"
    name: "Edge of Mars"
    description: "Video of a circular paper cut out mounted on a wall"
    thumbnail: "/assets/img/works/in-utopia/edge-of-mars.webp"
    uploadDate: "2018-06-01"
    duration: "PT6M15S"

gallery:
  - url: "/assets/img/works/in-utopia/gallery/1.webp"
    title: "Pareidolia (Cloud)"
    alt: "Wall mounted glazed ceramic"
  - url: "/assets/img/works/in-utopia/gallery/2.webp"
    title: "Pareidolia (Robot)"
    alt: "Glazed Ceramic"
  - url: "/assets/img/works/in-utopia/gallery/3.webp"
    title: "In Utopia Installation"
    alt: "In Utopia Installation"
  - url: "/assets/img/works/in-utopia/gallery/4.webp"
    title: "[Screen] ParkPlace [Sculpture] Cairn"
    alt: "Wood, plaster, clay, plastic sheet, glazed ceramic, pen, TV, metal off-cuts, still image"
  - url: "/assets/img/works/in-utopia/gallery/5.webp"
    title: "Fedora"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/6.webp"
    title: "Fedora"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/7.webp"
    title: "Fedora"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/8.webp"
    title: "Fedora"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/9.webp"
    title: "Fedora [Detail]"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/10.webp"
    title: "Fedora [Detail]"
    alt: "Tarpoulin, acrylic, found objects, plastic, glazed ceramic, plaster, unfired clay, 25mm steel square-tube, 3D printed SLS plastic"
  - url: "/assets/img/works/in-utopia/gallery/11.webp"
    title: "In Utopia Installation"
    alt: "In Utopia Installation"
  - url: "/assets/img/works/in-utopia/gallery/12.webp"
    title: "[Video] Yeah, about utopia... [Sculpture] Smoke Stack"
    alt: "Single channel video. Duration: 06 minutes, 15 seconds. 25mm steel square-tube, TV, 3D printed SLS plastic, headphones"
---

<figure class="main-article__figure">
    <img src="{{ gallery[0].url  }}" alt="{{ gallery[0].alt }}" title="{{ gallery[0].title }}">
        <figcaption>
            "{{ gallery[0].title }}". {{ gallery[0].alt }}.
        </figcaption>
</figure>

<br>

<p class="indent">In Utopia was an installation of a made for my undergraduate degree show group exhibition in 2018. The installation consisted of a series of large sculptures, ceramics, improvised structures and a single channel video mockumentary.</p>

<br>
<br>

<video width="100%" height="100%" controls controlsList="nodownload" poster="{{ video[0].thumbnail }}">
    <source src="{{ video[0].url }}" type="video/mp4">
    Your browser does not support the video tag.
</video>
<figcaption>
    "{{ video[0].name }}". {{ video[0].description }}.
</figcaption>

<br>

<p class="indent">text here</p>

<br>
<br>

<video width="50%" height="100%" controls controlsList="nodownload" poster="{{ video[1].thumbnail }}">
    <source src="{{ video[1].url }}" type="video/mp4">
    Your browser does not support the video tag.
</video>
<figcaption>
    "{{ video[1].name }}". {{ video[1].description }}.
</figcaption>

<br>

<p>text here</p>

<br>
<br>