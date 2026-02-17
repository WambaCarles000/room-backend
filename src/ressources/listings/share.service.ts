import { Injectable, NotFoundException } from '@nestjs/common';
import { AppDataSource } from '../../database/data-source';
import { Listing } from './listing.entity';

export interface ShareData {
  url: string;
  title: string;
  description: string;
  image: string;
  platform: string;
}

@Injectable()
export class ShareService {
  private readonly listingRepo = AppDataSource.getRepository(Listing);
  private readonly baseUrl = process.env.FRONTEND_URL ;

  async generateShareData(listingId: string, platform: string): Promise<ShareData> {
    const listing = await this.listingRepo.findOne({
      where: { id: listingId },
      relations: ['images', 'owner'],
    });

    if (!listing) {
      throw new NotFoundException('Annonce non trouvée');
    }

    const listingUrl = `${this.baseUrl}/listings/${listingId}`;
    const image = listing.images?.[0]?.imageUrl || `${this.baseUrl}/default-listing.jpg`;

    const title = `${listing.title} - ${listing.price} ${listing.currency}`;
    const description = listing.description.substring(0, 160) || `Découvrez cette annonce: ${listing.title}`;

    return {
      url: listingUrl,
      title,
      description,
      image,
      platform,
    };
  }

  generateMetaTags(data: ShareData): string {
    const metaTags = [
      // Open Graph pour Facebook et LinkedIn
      `<meta property="og:url" content="${this.escapeHtml(data.url)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${this.escapeHtml(data.title)}" />`,
      `<meta property="og:description" content="${this.escapeHtml(data.description)}" />`,
      `<meta property="og:image" content="${this.escapeHtml(data.image)}" />`,

      // Twitter Card
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${this.escapeHtml(data.title)}" />`,
      `<meta name="twitter:description" content="${this.escapeHtml(data.description)}" />`,
      `<meta name="twitter:image" content="${this.escapeHtml(data.image)}" />`,

      // Meta tags généraux
      `<meta name="description" content="${this.escapeHtml(data.description)}" />`,
      `<meta name="title" content="${this.escapeHtml(data.title)}" />`,
    ];

    return metaTags.join('\n');
  }

  generateShareUrl(data: ShareData): string {
    switch (data.platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;

      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`;

      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;

      case 'whatsapp':
        const message = `${data.title}\n${data.description}\n${data.url}`;
        return `https://wa.me/?text=${encodeURIComponent(message)}`;

      case 'email':
        const subject = `Découvrez cette annonce: ${data.title}`;
        const body = `${data.description}\n\n${data.url}`;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      default:
        return data.url;
    }
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async trackShare(listingId: string, platform: string): Promise<void> {
    // Optionnel: Vous pouvez ajouter un tracking des partages en base de données
    // pour des statistiques ultérieures
    console.log(`Annonce ${listingId} partagée sur ${platform}`);
  }
}
