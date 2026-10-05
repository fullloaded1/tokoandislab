import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitInquiry } from './actions';
import { prisma } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  prisma: {
    institution: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    contact: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    inquiry: {
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('submitInquiry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully submit an inquiry with sourceArticleId', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('institutionName', 'Test Inst');
    formData.append('type', 'RUMAH_SAKIT');
    formData.append('address', 'Jl. Test No 1');
    formData.append('contactName', 'John Doe');
    formData.append('phone', '081234567890');
    formData.append('email', 'john@test.com');
    formData.append('sourceArticleId', 'article-123');
    formData.append('items', JSON.stringify([{ productId: 'prod-1', qty: 2 }]));

    (prisma.institution.findUnique as any).mockResolvedValue(null);
    (prisma.institution.create as any).mockResolvedValue({ id: 'inst-1' });
    (prisma.contact.findFirst as any).mockResolvedValue(null);
    (prisma.contact.create as any).mockResolvedValue({ id: 'contact-1' });
    (prisma.inquiry.count as any).mockResolvedValue(0);
    (prisma.inquiry.create as any).mockResolvedValue({ inquiryNo: 'INQ-2026-0001' });

    // Act
    const result = await submitInquiry(formData);

    // Assert
    expect(result.success).toBe(true);
    expect(result.inquiryNo).toBe('INQ-2026-0001');
    expect(prisma.inquiry.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sourceArticleId: 'article-123',
          institutionId: 'inst-1',
        }),
      })
    );
  });
});
